const assert = require('node:assert/strict');
const test = require('node:test');
const { formatPreview, reportPreview } = require('./preview.cjs');

const commit = 'a'.repeat(40);
const repository = { owner: 'Themerr', repo: 'ThemerrDB' };
const fork = { id: 7, owner: { login: 'contributor' } };
const pull = { number: 12, state: 'open', head: { repo: fork, sha: commit, ref: 'add-data' } };
const run = {
  event: 'pull_request', conclusion: 'success', id: 45, run_attempt: 2,
  head_sha: commit, head_branch: 'add-data', head_repository: fork, pull_requests: [],
};
const artifact = `jackal-preview-${commit}-2`;

function workflowRun({ artifacts = [{ name: artifact, expired: false }], comments = [], current = pull } = {}) {
  const calls = [];
  const context = { repo: repository, payload: { workflow_run: run } };
  const github = {
    rest: {
      actions: { listWorkflowRunArtifacts: () => {} },
      pulls: { list: () => {}, get: async () => ({ data: current }) },
      issues: {
        listComments: () => {},
        createComment: async args => calls.push(['create', args]),
        updateComment: async args => calls.push(['update', args]),
      },
    },
    async paginate(endpoint, args) {
      if (endpoint === this.rest.actions.listWorkflowRunArtifacts) {
        assert.equal(args.run_id, 45);
        assert.ok(!args.name || args.name === artifact);
        return args.name ? artifacts.filter(item => item.name === args.name) : artifacts;
      }
      if (endpoint === this.rest.pulls.list) {
        assert.equal(args.head, 'contributor:add-data');
        return [pull, { ...pull, number: 13, head: { ...pull.head, repo: { id: 8 } } }];
      }
      assert.equal(args.issue_number, 12);
      return comments;
    },
  };
  return { github, context, calls };
}

test('the local commands download one specific run attempt and mount it read-only', () => {
  const body = formatPreview(repository, 45, commit, 2);
  const command = `gh run download 45 --repo Themerr/ThemerrDB --name ${artifact}`;
  assert.equal(body.split(command).length - 1, 2);
  assert.match(body, /\b127\.0\.0\.1:8080:80\b/);
  assert.match(body, /target=\/usr\/share\/nginx\/html,readonly/);
  assert.throws(() => formatPreview(repository, '45; echo wrong', commit, 2), /Invalid repository or run ID/);
});

test('a fork build can report to the correct PR without PR numbers in the workflow event', async () => {
  const inputs = workflowRun();
  await reportPreview(inputs);
  assert.equal(inputs.calls.length, 1);
  assert.equal(inputs.calls[0][0], 'create');
  assert.equal(inputs.calls[0][1].issue_number, 12);
  assert.match(inputs.calls[0][1].body, new RegExp(artifact));
});

test('a run for an outdated head or missing exact artifact does not post a preview', async () => {
  for (const options of [
    { current: { ...pull, head: { ...pull.head, sha: 'b'.repeat(40) } } },
    { artifacts: [{ name: `jackal-preview-${'b'.repeat(40)}-2`, expired: false }] },
    { artifacts: [{ name: artifact, expired: true }] },
  ]) {
    const inputs = workflowRun(options);
    await reportPreview(inputs);
    assert.deepEqual(inputs.calls, []);
  }
});

test('a retry of downstream jobs can report the artifact from the prior build attempt', async () => {
  const inputs = workflowRun({ artifacts: [{ name: `jackal-preview-${commit}-1`, expired: false }] });
  await reportPreview(inputs);
  assert.match(inputs.calls[0][1].body, new RegExp(`jackal-preview-${commit}-1`));
});

test('only a previous preview comment owned by GitHub Actions is updated', async () => {
  const body = '<!-- jackal-preview -->\nPrevious preview';
  const inputs = workflowRun({ comments: [
    { id: 1, user: { type: 'User', login: 'reviewer' }, body },
    { id: 2, user: { type: 'Bot', login: 'github-actions[bot]' }, body },
  ] });
  await reportPreview(inputs);
  assert.equal(inputs.calls.length, 1);
  assert.equal(inputs.calls[0][0], 'update');
  assert.equal(inputs.calls[0][1].comment_id, 2);
});
