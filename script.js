const LOCAL_STORAGE_LIST_KEY = 'task.lists'
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId'
const listsContainer = document.querySelector('[data-lists]')
const newListForm = document.querySelector('[data-new-list]')
const newListInput = document.querySelector('[data-new-list-input]')
const deleteListBtn = document.querySelector('[data-delete-list-btn]')
const listDisplay = document.querySelector('[data-list-display]')
const listTitle = document.querySelector('[data-list-title]')
const listCount = document.querySelector('[data-list-count]')
const taskContainer = document.querySelector('[data-tasks]')
const taskTemplate = document.querySelector('task-template')
const newTaskForm = document.querySelector('[data-new-task-form]')
const newTaskInput = document.querySelector('[data-new-task-input]')
const clearCompeteTaskBtn = document.querySelector('[data-clear-complete-tasks-btn]')


let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY) )|| []
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)


clearCompeteTaskBtn.addEventListener('click', e => {
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks = selectedList.tasks.filter(task => !task.complete)
    saveAndRender()
})


taskContainer.addEventListener('click', e =>{
    if(e.target.tagName.toLowerCase() === 'input'){
        const selectedList = lists.find(list => list.id === selectedListId)
        const selectedTask =  selectedList.tasks.find(task => task.id === e.target.id)
        selectedTask.complete = e.target.checked
        save()
        renderCount(selectedList)
    }
})

newListForm.addEventListener('submit', e => {
    e.preventDefault()
    const listName = newListInput.value
    if(listName == null || listName === '') return

    const list = createList(listName)
    newListInput.value = null
    lists.push(list)
    saveAndRender()
})


newTaskForm.addEventListener('submit', e => {
    e.preventDefault()
    const taskName = newTaskInput.value
    if(taskName == null || taskName === '') return

    const task = createTask(taskName)
    newTaskInput.value = null
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks.push(task)
    saveAndRender()
})

function createTask(name) {
    return {id: Date.now().toString(), name: name, complete: false }
}

listsContainer.addEventListener('click', e=>{
    if (e.target.tagName.toLowerCase() === 'li'){
        selectedListId = e.target.dataset.listId
        saveAndRender()
    }
})

deleteListBtn.addEventListener('click', e =>{
    lists = lists.filter(list => list.id !== selectedListId)
    selectedListId = null
    saveAndRender()
})

function saveAndRender(){
    save()
    render()
}

function save(){
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY ,JSON.stringify(lists))
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
}

function createList(name){
    return {id: Date.now().toString(), name: name, tasks:[]}
}

function render(){   
    clearElement(listsContainer)
    renderLists()
    const selectedList = lists.find(list => list.id === selectedListId)
    if(selectedListId == null){
        listDisplay.style.display = 'none'
    }else{
        listDisplay.style.display = ''
        listTitle.innerText = selectedList.name
        renderCount(selectedList)
        clearElement(taskContainer)
        renderTasks(selectedList)
    }
}

function renderCount(selectedList){
    const incompleteTasks = selectedList.tasks.filter(task => !task.complete).length
    const taskString = incompleteTasks === 1 ? "task" : "tasks"
    listCount.innerText = `${incompleteTasks} ${taskString} remaining`
}

function renderLists() {
    lists.forEach(list => {
        const listElement = document.createElement('li')
        listElement.dataset.listId = list.id
        listElement.classList.add('name-list')
        listElement.innerText = list.name
        if (list.id === selectedListId) {
            listElement.classList.add('current-list')
        }
        listsContainer.appendChild(listElement)
    })
}

function renderTasks(selectedList){
    selectedList.taskContainer.forEach(task =>{
        const taskElement = document.importNode(taskTemplate.content, true)
        const checkbox = taskElement.querySelector('input')
        checkbox.id = task.id
        checkbox.checked = task.complete
        const label = taskElement.querySelector('label')

        label.htmlFor = task.id
        label.append(task.name)
        taskContainer.appendChild(taskElement)

    })
}

function clearElement(element){
    while(element.firstChild){
        element.removeChild(element.firstChild)
    }
}


render()




