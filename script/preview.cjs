const OWNER_REPO = /^[A-Za-z0-9_.-]+$/;
const SHA = /^[a-f0-9]{40}$/;
const POSITIVE_INTEGER = /^[1-9][0-9]*$/;
const MARKER = '<!-- jackal-preview -->';

function getMainArtifact(sha, attempt) {
  if (!SHA.test(sha) || !POSITIVE_INTEGER.test(attempt)) {
    throw new Error('Invalid build commit or run attempt');
  }
  return `jackal-preview-${sha}-${attempt}`;
}

function formatPreview({ owner, repo }, runId, sha, attempt) {
  if (!OWNER_REPO.test(owner) || !OWNER_REPO.test(repo) || !POSITIVE_INTEGER.test(runId)) {
    throw new Error('Invalid repository or run ID');
  }
  const artifact = getMainArtifact(sha, attempt);
  const download = `gh run download ${runId} --repo ${owner}/${repo} --name ${artifact}`;
  const serve = 'docker run --rm -p 127.0.0.1:8080:80 ' +
    '--mount "type=bind,source=$preview,target=/usr/share/nginx/html,readonly" nginx:alpine';

  return [
    MARKER,
    '### Preview this build',
    '',
    `Commit \`${sha}\` · [CI run ${runId}, attempt ${attempt}](https://github.com/${owner}/${repo}/actions/runs/${runId})`,
    '',
    'With Docker running and GitHub CLI signed in, paste one command:',
    '',
    '**PowerShell**',
    '',
    '```powershell',
    '$preview = Join-Path ([IO.Path]::GetTempPath()) ("jackal-" + [guid]::NewGuid()); ' +
      `${download} --dir "$preview"; if ($LASTEXITCODE -eq 0) { ${serve} }`,
    '```',
    '',
    '**Bash or Zsh**',
    '',
    '```sh',
    `preview="$(mktemp -d)" && ${download} --dir "$preview" && ${serve}`,
    '```',
    '',
    'Open [localhost:8080](http://127.0.0.1:8080). Stop the server with Ctrl+C.',
    'The download is retained by GitHub Actions for up to 14 days.',
    '',
  ].join('\n');
}

function sameHead(pull, headRepository, sha) {
  return pull.state === 'open' && pull.head.repo?.id === headRepository && pull.head.sha === sha;
}

async function findPreviewAttempt(github, repository, runId, sha, attempt) {
  const exact = getMainArtifact(sha, attempt);
  const params = { ...repository, run_id: runId };
  const artifacts = github.rest.actions.listWorkflowRunArtifacts;
  const current = await github.paginate(artifacts, { ...params, name: exact });
  if (current.some(item => item.name === exact && !item.expired)) return attempt;

  // Rerunning only failed jobs can reuse the successful build from an
  // earlier attempt. Report the attempt that actually produced its files.
  const prefix = `jackal-preview-${sha}-`;
  const earlier = await github.paginate(artifacts, params);
  return earlier.reduce((latest, item) => {
    if (item.expired || !item.name.startsWith(prefix)) return latest;
    const suffix = item.name.slice(prefix.length);
    if (!POSITIVE_INTEGER.test(suffix) || Number(suffix) >= Number(attempt)) return latest;
    return Math.max(latest, Number(suffix));
  }, 0);
}

async function reportPreview({ github, context }) {
  const { repo: repository, payload, runId: currentRunId } = context;
  const run = payload.workflow_run;
  const pull = payload.pull_request;
  if (run && (run.event !== 'pull_request' || run.conclusion !== 'success')) return;
  if (!run && (!pull || pull.head.repo.id !== pull.base.repo.id)) return;

  const headRepository = run ? run.head_repository : pull.head.repo;
  if (!headRepository) return;
  const sha = run?.head_sha ?? pull.head.sha;
  const runId = run?.id ?? currentRunId;
  const attempt = await findPreviewAttempt(github, repository, runId, sha,
    run?.run_attempt ?? process.env.GITHUB_RUN_ATTEMPT);
  if (!attempt) return;

  // Fork PRs can be absent from workflow_run.pull_requests. Resolve them by
  // the actual head repository, branch and commit, never by an artifact field.
  const head = run?.head_branch ?? pull.head.ref;
  const candidates = pull ? [pull] : await github.paginate(github.rest.pulls.list, {
    ...repository, state: 'open', head: `${headRepository.owner.login}:${head}`,
  });
  const body = formatPreview(repository, runId, sha, attempt);
  for (const candidate of candidates.filter(item => sameHead(item, headRepository.id, sha))) {
    const params = { ...repository, issue_number: candidate.number };
    const comments = await github.paginate(github.rest.issues.listComments, params);
    const existing = comments.find(comment =>
      comment.user?.type === 'Bot' && comment.user.login === 'github-actions[bot]' && comment.body?.startsWith(MARKER),
    );
    const { data: current } = await github.rest.pulls.get({ ...repository, pull_number: candidate.number });
    if (!sameHead(current, headRepository.id, sha) || existing?.body.trimEnd() === body.trimEnd()) continue;
    if (existing) {
      await github.rest.issues.updateComment({ ...repository, comment_id: existing.id, body });
    } else {
      await github.rest.issues.createComment({ ...params, body });
    }
  }
}

module.exports = { formatPreview, reportPreview };
