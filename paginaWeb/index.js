//conexion a base de datos 
const db = firebase.firestore();

//en la constante taskForm consignare el documento (document) donde selecciono (getElementById)  un elemento donde el (task-form) sea mi id 
const taskForm  = document.getElementById('task-form'); 

//en estas variable guardare los valores que se reflejaran en la ventana
const taskContainer = document.getElementById('tasks-container');

//creare una varialbe donde guarde el estatus de el formulario para poder saber si se guarda o se actulilza
let editStatus = false;

let id = '';

//guardare en la variable (saveTask) que recibira el action y tipo y que genere la sigueinte funcion
//en mi base de datos voy a guardar en la coleccion que se llame (banner) donde voy a guardar un documento y con los siguientes parametros 
const saveTask = (action, tipo, idb, url, orden, active, star, end) => 
      db.collection("banner").doc().set({
            action,
            tipo,
            idb,
            url,
            orden,
            active,
            star,
            end,
      });

//en la variagle (getTaks) cuando se ejecute le digo que traiga todo de mi base de datos
const getTasks = () => db.collection('banner').get();

//esta es la funcion donde recibo los datos y los envio a la caja de texto
const getTask = (id) => db.collection('banner').doc(id).get();

//funcion que es llamada para cuando se agregue un dato se pueda ver de inmediato
const onGetTasks = (callback) => db.collection('banner').onSnapshot(callback)

//la funcion para eliminar tareas con las varialbes ya definidas 
const deleteTask = id => db.collection('banner').doc(id).delete();

//funcion donde llamo a las variables para poder actualizar los datos
const updateTask = (id, updateTask) => db.collection('banner').doc(id).update(updateTask);

//voy añadir un evento a la ventana: cuando el Dom haya cargado el contenido quiero mostrar un evento 
window.addEventListener('DOMContentLoaded', async (e) => {
      onGetTasks((querySnapshot) => {
            taskContainer.innerHTML = '';
            querySnapshot.forEach(doc => {

                  const task = doc.data();
                  task.id = doc.id;

                  taskContainer.innerHTML += `
                  <div style=" margin: 20px;">
                        <div style="border: solid; display: flex;" >
                              <ul style="margin: 20px;">
                                    <li style="display: flex;"><h4>Tipo :</h4>${task.tipo}</li>
                                    <li style="display: flex;"><h4>DataAction :</h4>${task.action}</li>
                                    <li style="display: flex;"><h4>Id :</h4>${task.idb}</li>
                                    <li style="display: flex;"><h4>Url :</h4>${task.url}</li>
                                    <li style="display: flex;"><h4>Url :</h4>${task.orden}</li>
                                    <li style="display: flex;"><h4>Url :</h4>${task.active}</li>
                                    <li style="display: flex;"><h4>Url :</h4>${task.star}</li>
                                    <li style="display: flex;"><h4>Url :</h4>${task.end}</li>
                                    
                              </ul>
                        </div>
                        <div style="border: solid;">
                        <button class="btn botonEliminarJS btn-eliminar" data-id="${task.id}">Eliminar</button>
                        <button class="btn botonEliminarJS btn-edit" data-id="${task.id}">Editar</button>
                        </div>
                  </div>`;

//la funcion donde defino el boton de elminar correlacionado con id de cada documento dentro de la coleccion
                  const btnD = document.querySelectorAll('.btn-eliminar');
                  btnD.forEach(btn => {
                        btn.addEventListener('click', async (e) => {
                              await deleteTask(e.target.dataset.id)
                        })
                  })

//la funcion donde defino el boton de editar correlacionado con el id de cada tarea dentro de la coleccion
                  const btnEdit = document.querySelectorAll('.btn-edit');
                  btnEdit.forEach(btn => {
                        btn.addEventListener('click', async e => {
                              const doc = await getTask(e.target.dataset.id);
                              const task = doc.data();

                              editStatus = true;
                              id = doc.id;

                              taskForm['task-action'].value = task.action
                              taskForm['task-tipo'].value = task.tipo
                              taskForm['task-idb'].value = task.idb
                              taskForm['task-url'].value = task.url
                              taskForm['task-orden'].value = task.orden
                              taskForm['task-active'].value = task.active
                              taskForm['task-star'].value = task.star
                              taskForm['task-end'].value = task.end
                              taskForm['btn-task-form'].innerText = 'Update'
                        })
                  })
            });
      });  
});

//llamare la variable (taskForm) donde escuchare su evento (addEventListener) cada vez que se envie (submit) voy a capturarlo (e)
taskForm.addEventListener('submit', async (e) => {
      e.preventDefault();

//voy a guardar en la variable (action) el llamado que le hago (taskForm) quiero captuara ([task-title]) el valor (.value) de lo que haya tipeado
      const action = taskForm['task-action'];
      const tipo = taskForm['task-tipo'];
      const idb = taskForm['task-idb'];
      const url = taskForm['task-url'];
      const orden = taskForm['task-orden'];
      const active = taskForm['task-active'];
      const star = taskForm['task-star'];
      const end = taskForm['task-end'];

//voy a utlizar mi funcion (saveTask) que recibe dos cosas un action y un tipo 
      if(!editStatus) {
            await saveTask(action.value, tipo.value, idb.value, url.value, orden.value, active.value, star.value, end.value);
      }else{
            await updateTask(id, {
                  action: action.value,
                  tipo: tipo.value,
                  idb: idb.value,
                  url: url.value,
                  orden: orden.value,
                  active: active.value,
                  star: star.value,
                  end: end.value,
            });

            editStatus = false;
            id = '';

            taskForm['btn-task-form'].innerText = 'Guardar';
      }

      await getTasks();
      
//una ves cargada la variables limpiar el formulario
      taskForm.reset();
//cuando se recargue el formulario quiero que el curson vuelva al action 
      action.focus();

      console.log(action, tipo, idb, url, orden, active, star, end)
});