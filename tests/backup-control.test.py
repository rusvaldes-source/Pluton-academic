import importlib.util,os,subprocess,tempfile,unittest
from pathlib import Path

SCRIPT=Path(__file__).resolve().parents[1]/'scripts/verificar-respaldo.py'
spec=importlib.util.spec_from_file_location('backup',SCRIPT);backup=importlib.util.module_from_spec(spec);spec.loader.exec_module(backup)

class BackupControl(unittest.TestCase):
 def test_remote_backup_and_unsaved_changes(self):
  with tempfile.TemporaryDirectory() as folder:
   original=Path.cwd();root=Path(folder);repo=root/'repo';remote=root/'remote.git'
   def run(*args):return subprocess.run(['git',*args],check=True,capture_output=True,text=True)
   run('init','--bare',str(remote));run('init','-b','B107',str(repo))
   try:
    os.chdir(repo);run('config','user.name','Backup Test');run('config','user.email','qa@example.invalid');run('remote','add','origin',str(remote))
    Path('example.txt').write_text('one');run('add','example.txt');run('commit','-m','checkpoint')
    self.assertFalse(backup.verify('B107')['backed_up'])
    run('push','origin','B107');self.assertTrue(backup.verify('B107')['backed_up'])
    Path('example.txt').write_text('two');run('add','example.txt');run('commit','-m','not yet saved')
    self.assertFalse(backup.verify('B107')['backed_up'])
    run('push','origin','B107');self.assertTrue(backup.verify('B107')['backed_up'])
    Path('pending.txt').write_text('unfinished')
    result=subprocess.run(['python3',str(SCRIPT)],capture_output=True,text=True)
    self.assertEqual(result.returncode,1);self.assertIn('"pending_files": 1',result.stdout)
   finally:os.chdir(original)

if __name__=='__main__':unittest.main()
