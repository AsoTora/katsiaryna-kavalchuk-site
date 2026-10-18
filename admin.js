const list=document.getElementById('enquiries');const status=document.getElementById('admin-status');const more=document.getElementById('load-more');let next=null;
function node(tag,text){const el=document.createElement(tag);el.textContent=text;return el;}
async function load(append=false){status.textContent='Загрузка…';more.disabled=true;
 try{const response=await adminApi.fetch('/api/admin/enquiries'+(append&&next?'?before='+next:''),{cache:'no-store'});if(!response.ok)throw new Error('Недоступно');const data=await response.json();if(!append)list.replaceChildren();
 for(const enquiry of data.enquiries){const card=node('article','');card.className='enquiry';card.append(node('p',new Date(enquiry.created_at).toLocaleString('ru-RU')),node('h2',enquiry.name),node('p',enquiry.email),node('p',enquiry.pair),node('p',enquiry.task),node('p','Объём и срок: '+enquiry.deadline));
 const files=node('ul','');for(const file of enquiry.files){const li=node('li','');const a=node('a',file.filename+' · '+(file.size/1024/1024).toFixed(2)+' МБ');a.href='#';a.addEventListener('click',e=>{e.preventDefault();adminApi.download('/api/admin/files/'+encodeURIComponent(file.id),file.filename).catch(()=>alert('Не удалось скачать файл.'));});li.append(a);files.append(li);}card.append(files);
 const reply=node('a','Ответить по email');reply.className='button dark';reply.href='mailto:'+encodeURIComponent(enquiry.email)+'?subject='+encodeURIComponent('Re: Заявка на перевод — '+enquiry.pair)+'&body='+encodeURIComponent('Здравствуйте, '+enquiry.name+'!\n\n');card.append(reply);list.append(card);}
 next=data.next;more.hidden=!next;status.textContent=list.children.length?'':'Заявок пока нет. Новые заявки появятся здесь.';
 }catch{status.textContent='Не удалось загрузить заявки. Попробуйте обновить список.';}finally{more.disabled=false;}}
document.getElementById('refresh').addEventListener('click',()=>load());more.addEventListener('click',()=>load(true));load();
