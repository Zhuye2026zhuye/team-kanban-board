let tasks = JSON.parse(localStorage.getItem('kanban_tasks')) || [];

function render() {
    document.getElementById('list-todo').innerHTML = '';
    document.getElementById('list-doing').innerHTML = '';
    document.getElementById('list-done').innerHTML = '';

    tasks.forEach(task => {
        const card = document.createElement('div');
        card.className = 'task-card';
        card.draggable = true; // 拖拽功能用
        card.dataset.id = task.id; // 拖拽功能用
        
        // 张鑫睿写的：带删除按钮的卡片内容
        card.innerHTML = `
            <span>${task.content}</span>
            <button class="delete-btn" onclick="deleteTask(${task.id})" style="float:right; color:red; border:none; background:transparent; cursor:pointer; font-weight:bold;">×</button>
        `;
        
        document.getElementById(`list-${task.status}`).appendChild(card);
    });

    localStorage.setItem('kanban_tasks', JSON.stringify(tasks));
}

// 张鑫睿写的：添加任务功能
function addTask() {
    const input = document.getElementById('task-input');
    const content = input.value.trim();
    if (!content) return alert('请输入任务内容！');
    
    const newTask = { id: Date.now(), content: content, status: 'todo' };
    tasks.push(newTask);
    input.value = ''; 
    render(); 
}

// 张鑫睿写的：删除任务功能
function deleteTask(id) {
    if (confirm('确定要删除这个任务吗？')) {
        tasks = tasks.filter(task => task.id !== id);
        render();
    }
}

// 初始渲染
render();