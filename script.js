const listsContainer = document.querySelector('[data-lists]')
const newListForm = document.querySelector('[data-new-list]')
const newListInput = document.querySelector('[data-new-list-input]')
const LOCAL_STORAGE_LIST_KEY = 'task.lists'
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId'
const deleteListBtn = document.querySelector('[data-delete-list-btn]')
const listDisplay = document.querySelector('[data-list-display]')
const listTitle = document.querySelector('[data-list-title]')
const listCount = document.querySelector('[data-list-count]')
const tasks = document.querySelector('[data-tasks]')
const taskTemplate = document.querySelector('task-template')


let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY) )|| []
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)



newListForm.addEventListener('submit', e => {
    e.preventDefault()
    const listName = newListInput.value
    if(listName == null || listName === '') return

    const list = createList(listName)
    newListInput.value = null
    lists.push(list)
    saveAndRender()
})

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
    return {id: Date.now().toString(), name: name, tasks:[{
        id: '233342',
        name: 'test',
        complete: false
    }]}
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
        clearElement(tasks)
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
    selectedList.tasks.forEach(task =>{
        const taskElement = document.importNode(taskTemplate.content, true)
        const checkbox = taskElement.querySelector('input')
        checkbox.id = task.id
        checkbox.checked = task.complete
        const label = taskElement.querySelector('label')

        label.htmlFor = task.id
        label.append(task.name)
        tasks.appendChild(taskElement)

    })
}

function clearElement(element){
    while(element.firstChild){
        element.removeChild(element.firstChild)
    }
}


render()




