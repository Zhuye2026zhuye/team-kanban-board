let tasks = JSON.parse(localStorage.getItem('kanban_tasks')) || [];

function render() {
    document.getElementById('list-todo').innerHTML = '';
    document.getElementById('list-doing').innerHTML = '';
    document.getElementById('list-done').innerHTML = '';

    tasks.forEach(task => {
        const card = document.createElement('div');
        card.className = 'task-card';
        card.draggable = true; // 拖拽需要
        card.dataset.id = task.id; // 拖拽需要
        
        // 融合了张鑫睿的删除按钮 和 张云云的基础结构
        card.innerHTML = `
            <span>${task.content}</span>
            <button class="delete-btn" onclick="deleteTask(${task.id})" style="float:right; color:red; border:none; background:transparent; cursor:pointer;">×</button>
        `;
        
        document.getElementById(`list-${task.status}`).appendChild(card);
    });

    localStorage.setItem('kanban_tasks', JSON.stringify(tasks));
}

// 张鑫睿：添加任务
function addTask() {
    const input = document.getElementById('task-input');
    const content = input.value.trim();
    if (!content) return alert('请输入任务内容！');
    const newTask = { id: Date.now(), content: content, status: 'todo' };
    tasks.push(newTask);
    input.value = '';
    render();
}

// 张鑫睿：删除任务
function deleteTask(id) {
    if (confirm('确定要删除这个任务吗？')) {
        tasks = tasks.filter(task => task.id !== id);
        render();
    }
}

// ================= 张云云：拖拽功能开始 =================

// 1. 开始拖拽卡片
document.addEventListener('dragstart', (e) => {
    const card = e.target.closest('.task-card');
    if (!card) return;
    
    e.dataTransfer.setData('text/plain', card.dataset.id);
    e.dataTransfer.effectAllowed = 'move';
    card.classList.add('dragging');
});

// 2. 拖拽结束，清理样式
document.addEventListener('dragend', (e) => {
    const card = e.target.closest('.task-card');
    if (card) {
        card.classList.remove('dragging');
    }
    document.querySelectorAll('.task-list').forEach(list => {
        list.classList.remove('drag-over');
    });
});

// 3. 给三个任务列表添加拖拽接收事件
document.querySelectorAll('.task-list').forEach(list => {
    list.addEventListener('dragover', (e) => {
        e.preventDefault(); // 必须阻止默认行为
        list.classList.add('drag-over');
    });

    list.addEventListener('dragleave', (e) => {
        list.classList.remove('drag-over');
    });

    list.addEventListener('drop', (e) => {
        e.preventDefault();
        list.classList.remove('drag-over');
        
        const taskId = e.dataTransfer.getData('text/plain');
        const newStatus = e.currentTarget.parentElement.dataset.status;
        
        // 更新任务状态
        const task = tasks.find(t => t.id == taskId);
        if (task) {
            task.status = newStatus;
            render();
        }
    });
});

// 初始化页面
render();