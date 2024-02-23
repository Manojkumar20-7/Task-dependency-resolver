document.addEventListener('DOMContentLoaded', function () {
    const taskTable = document.getElementById('schedule-table');
    const taskBody = document.getElementById('schedule-body');
    const tasks = [];

    document.getElementById('add-task').addEventListener('click', function () {
        const taskName = document.getElementById('task-name').value.trim();
        const dependencies = document.getElementById('dependencies').value.trim().split(',');

        if (taskName !== '') {
            const task = { name: taskName, dependencies: dependencies, startTime: 0 };
            tasks.push(task);

            document.getElementById('task-name').value = '';
            document.getElementById('dependencies').value = '';

            displaySchedule();
        }
    });

    function topologicalSort(tasks) {
        const inDegree = new Map();
        const result = [];

        for (const task of tasks) {
            inDegree.set(task.name, 0);
        }

        for (const task of tasks) {
            for (const dependency of task.dependencies) {
                inDegree.set(dependency, inDegree.get(dependency) + 1);
            }
        }

        const queue = [];
        for (const [taskName, degree] of inDegree.entries()) {
            if (degree === 0) {
                queue.push(taskName);
            }
        }

        while (queue.length > 0) {
            const currentTask = queue.shift();
            result.push(tasks.find(task => task.name === currentTask));

            for (const dependency of tasks.find(task => task.name === currentTask).dependencies) {
                inDegree.set(dependency, inDegree.get(dependency) - 1);
                if (inDegree.get(dependency) === 0) {
                    queue.push(dependency);
                }
            }
        }

        if (result.length !== tasks.length) {
            return [];
        }

        return result;
    }
    function displaySchedule() {
        taskBody.innerHTML = '';
    
        const sortedTasks = topologicalSort(tasks);
    
        if (sortedTasks.length === 0) {
            taskBody.innerHTML = '<tr><td colspan="2">Error: Circular dependencies detected. Cannot schedule tasks.</td></tr>';
            return;
        }
    
        for (const task of sortedTasks) {
            const dependencies = task.dependencies.join(', ');
            taskBody.innerHTML += `<tr><td>${task.name}</td><td>${dependencies}</td></tr>`;
        }
    }
    
});