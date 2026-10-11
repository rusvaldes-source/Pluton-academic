from pathlib import Path
import json,math,subprocess,numpy as np
ROOT=Path(__file__).resolve().parent.parent
def music(path,duration):
 sr=48000;n=round((duration+2)*sr);output=np.zeros((n,2),dtype=np.float64)
 def note(midi,start,length,amp,kind='pad',pan=0):
  first=round(start*sr);count=min(round(length*sr),n-first)
  if count<=0:return
  t=np.arange(count)/sr;freq=440*2**((midi-69)/12)
  if kind=='pad':
   signal=(np.sin(2*np.pi*freq*t)+.23*np.sin(2*np.pi*freq*2*t)+.12*np.sin(2*np.pi*freq*.5*t))/1.35
   envelope=np.minimum(1,t/1.2)*np.minimum(1,(length-t)/1.7);signal*=np.maximum(0,envelope)
  else:
   signal=np.sin(2*np.pi*freq*t)*np.exp(-t/1.3)+.24*np.sin(2*np.pi*freq*2.002*t)*np.exp(-t/.7)+.1*np.sin(2*np.pi*freq*3.995*t)*np.exp(-t/.4)
   signal*=np.minimum(1,t/.012)*np.maximum(0,np.minimum(1,(length-t)/.15))
  output[first:first+count,0]+=signal*amp*math.sqrt((1-pan)/2)
  output[first:first+count,1]+=signal*amp*math.sqrt((1+pan)/2)
 tempo=72;beat=60/tempo;bar=4*beat
 # Motivo y armonía originales; no se usan muestras, melodías ni grabaciones externas.
 chords=[[50,57,62,65,69],[46,53,58,62,65],[41,53,57,60,65],[48,55,60,64,67]]
 pattern=[0,2,1,3,2,4,1,2]
 for b,start in enumerate(np.arange(0,duration,bar*2)):
  chord=chords[b%4]
  for j,midi in enumerate(chord):note(midi,start,bar*2+1.8,.025 if j else .035,'pad',(-.4+j*.2))
  for k in range(8):
   if start+k*beat*1.0>duration-4:continue
   note(chord[pattern[k]]+12,start+k*beat*1.0,3,.019 if k%2 else .025,'piano',(-.4 if k%2 else .4))
 # Eco corto propio que añade espacio sin depender de grabaciones o reverberación ajena.
 for delay,gain in [(0.13,.13),(0.27,.08),(0.41,.05)]:
  offset=int(delay*sr);output[offset:]+=output[:-offset,::-1]*gain
 output=output[:int(duration*sr)]
 ramp=np.minimum(1,np.arange(len(output))/sr/2.5)*np.minimum(1,(duration-np.arange(len(output))/sr)/4)
 output*=np.maximum(0,ramp[:,None]);output*=.75/max(float(np.abs(output).max()),.001)
 raw=path.with_suffix('.f32');output.astype('<f4').tofile(raw)
 complete=path.with_name(path.stem+'.part.wav')
 subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(sr),'-ac','2','-i',str(raw),
                 '-af','loudnorm=I=-18:TP=-2:LRA=10,aresample=48000','-c:a','pcm_s24le',str(complete)],check=True)
 complete.replace(path);raw.unlink()
if __name__=='__main__':
 plan=json.loads((ROOT/'timeline.json').read_text());music(ROOT/plan['music'],plan['duration']);print('Música original regenerada; revisar antes de mezclar.')
