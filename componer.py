from pathlib import Path
from PIL import Image,ImageDraw,ImageFont,ImageOps
import json,math,argparse
ROOT=Path(__file__).resolve().parent
NAVY='#071328';GOLD='#d9b565';WHITE='#f3f5fb';MUTED='#b9c6dd'
FONT=ROOT/'assets/DejaVuSans.ttf';BOLD=ROOT/'assets/DejaVuSans-Bold.ttf'
def font(size,bold=False): return ImageFont.truetype(str(BOLD if bold else FONT),size)

def lines_px(text, face, maxwidth):
 result=[]
 for para in text.split('\n'):
  current=''
  for word in para.split():
   test=(current+' '+word).strip()
   if face.getlength(test)>maxwidth and current:result.append(current);current=word
   else: current=test
  if current:result.append(current)
 return result

def frame(scene,language,image,root):
 im=Image.new('RGB',(1920,1080),NAVY);d=ImageDraw.Draw(im)
 # Composición gráfica nueva; imágenes aprobadas conservan proporción e identidad.
 for y in range(1080):
  v=math.exp(-((y-380)/600)**2)
  d.line((0,y,1919,y),fill=(int(7+3*v),int(19+6*v),int(40+12*v)))
 d.text((104,65),'PLUTÓN',font=font(30,True),fill=WHITE)
 d.text((266,65),'ACADEMIC',font=font(30),fill=GOLD)
 d.line((104,120,1816,120),fill='#334260',width=2)
 photo=Image.open(image).convert('RGB')
 if scene['movement']=='photo':
  eyebrow='EDUCACIÓN PARA AVANZAR' if language=='es' else 'EDUCATION TO MOVE FORWARD'
  d.text((106,280),eyebrow,font=font(21,True),fill=GOLD)
  title=lines_px(scene['title'][language],font(64,True),680)
  d.multiline_text((100,340),'\n'.join(title),font=font(64,True),fill=WHITE,spacing=13)
  motto='Conocimiento hoy.\nOportunidades mañana.' if language=='es' else 'Knowledge today.\nOpportunities tomorrow.'
  d.multiline_text((106,730),motto,font=font(25),fill=MUTED,spacing=12)
  box=(845,175,1816,895); fitted=ImageOps.contain(photo,(box[2]-box[0]-6,box[3]-box[1]-6),Image.Resampling.LANCZOS)
  x=box[0]+(box[2]-box[0]-fitted.width)//2;y=box[1]+(box[3]-box[1]-fitted.height)//2
  d.rectangle(box,fill='#0c1b33',outline='#625841',width=2);im.paste(fitted,(x,y))
 else:
  title=lines_px(scene['title'][language],font(43,True),1650)
  d.multiline_text((105,145),'\n'.join(title),font=font(43,True),fill=WHITE,spacing=6)
  box=(105,285,1815,945);fitted=ImageOps.contain(photo,(box[2]-box[0]-10,box[3]-box[1]-10),Image.Resampling.LANCZOS)
  x=box[0]+(box[2]-box[0]-fitted.width)//2;y=box[1]+(box[3]-box[1]-fitted.height)//2
  d.rounded_rectangle(box,radius=14,fill='#050b17',outline='#334260',width=2);im.paste(fitted,(x,y))
  if scene['id'] in ['W03','W06','W07']:
   text='CUENTA DE DEMOSTRACIÓN · DATOS DE EJEMPLO' if language=='es' else 'DEMO ACCOUNT · SAMPLE DATA'
   d.text((108,248),text,font=font(20,True),fill=GOLD)
  elif scene['id']=='W08':
   text='CONTRATACIÓN Y PAGOS WEB NO HABILITADOS' if language=='es' else 'ONLINE ENROLLMENT AND PAYMENTS NOT ENABLED'
   d.text((108,248),text,font=font(20,True),fill=GOLD)
  elif scene['id']=='W09':
   text='MODELO INFORMATIVO · SIN EMISIÓN AUTOMÁTICA NI VERIFICACIÓN' if language=='es' else 'INFORMATIONAL SAMPLE · NO AUTOMATIC ISSUANCE OR VERIFICATION'
   d.text((108,248),text,font=font(20,True),fill=GOLD)
 d.text((106,1026),'PLUTÓN ACADEMIC',font=font(18),fill=MUTED)
 d.text((1620,1026),scene['id']+' · '+language.upper(),font=font(18),fill=MUTED)
 p=root/'frames'/f'{scene["id"]}_{language}.jpg';p.parent.mkdir(exist_ok=True);im.save(p,quality=94,subsampling=0)
 return str(p.relative_to(root))
if __name__=='__main__':
 p=argparse.ArgumentParser(description='Regenerar composiciones editables de PLUTÓN, sin alterar B56');p.add_argument('--idioma',choices=['es','en','ambos'],default='ambos');args=p.parse_args();plan=json.loads((ROOT/'timeline.json').read_text())
 for scene in plan['scenes']:
  for language in ['es','en'] if args.idioma=='ambos' else [args.idioma]:
   file=ROOT/'assets'/(scene['asset'] if scene['movement']=='photo' else scene['asset']+'_'+language+'.png')
   frame(scene,language,file,ROOT)
 print('Composiciones regeneradas en frames/. Revisar y actualizar storyboard antes de renderizar.')
