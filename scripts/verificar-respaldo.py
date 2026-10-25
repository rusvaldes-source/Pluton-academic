"""Verify committed branch backups and detect work not yet committed. Read-only."""
import argparse,json,subprocess,sys

def git(*args,check=True):
    return subprocess.run(['git',*args],text=True,capture_output=True,check=check)

def verify(branch,remote='origin'):
    local=git('rev-parse','refs/heads/'+branch).stdout.strip()
    fetched=git('fetch','--no-tags',remote,'refs/heads/'+branch,check=False)
    if fetched.returncode:
        return {'branch':branch,'local_commit':local,'backed_up':False,'reason':'Remote branch unavailable or fetch failed'}
    remote_sha=git('rev-parse','FETCH_HEAD').stdout.strip()
    ancestor=git('merge-base','--is-ancestor',local,remote_sha,check=False).returncode==0
    same_tree=git('rev-parse',local+'^{tree}').stdout==git('rev-parse',remote_sha+'^{tree}').stdout
    return {'branch':branch,'local_commit':local,'remote_commit':remote_sha,'backed_up':ancestor or same_tree,'verification':'commit ancestry' if ancestor else 'identical file tree' if same_tree else 'remote differs'}

def main():
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--all',action='store_true',help='Check every local branch');p.add_argument('--remote',default='origin');a=p.parse_args()
    current=git('branch','--show-current').stdout.strip()
    branches=git('for-each-ref','--format=%(refname:short)','refs/heads/').stdout.splitlines() if a.all else [current]
    branches=[b for b in branches if b]
    pending=git('status','--porcelain=v1','--untracked-files=all').stdout.splitlines()
    results=[verify(b,a.remote) for b in branches]
    ready=bool(results) and not pending and all(r['backed_up'] for r in results)
    print(json.dumps({'ready':ready,'branches':results,'pending_files':len(pending),'pending_review_required':bool(pending)},ensure_ascii=False,indent=2))
    return 0 if ready else 1

if __name__=='__main__':sys.exit(main())
