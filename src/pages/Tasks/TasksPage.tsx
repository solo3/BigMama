import { useState } from 'react';
import { Plus, Trash2, Edit2, Calendar } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import { useFamilyMembers } from '../../hooks/useFamily';
import { useAuth } from '../../hooks/useAuth';
import { createTask, updateTask, deleteTask, toggleTaskStatus } from '../../services/tasks';
import { TaskModal } from '../../components/common/Modals/TaskModal';
import { Task } from '../../types/models';
import './Tasks.css';

type TabType = 'todo' | 'mine' | 'completed';

export const TasksPage = () => {
    const { tasks, loading: tasksLoading } = useTasks();
    const { members } = useFamilyMembers();
    const { user, familyId } = useAuth();
    const [activeTab, setActiveTab] = useState<TabType>('todo');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const handleCreateTask = () => {
        setEditingTask(null);
        setIsModalOpen(true);
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const handleSaveTask = async (taskData: Partial<Task>) => {
        if (!familyId) return;

        try {
            if (editingTask) {
                await updateTask(familyId, editingTask.id, taskData);
            } else {
                await createTask(familyId, {
                    ...taskData,
                    status: 'todo',
                    assignees: taskData.assignees || [],
                    createdBy: user?.uid || '',
                    title: taskData.title || '',
                } as any); // Type assertion needed because Omit<Task, ...> logic in service might be strict or type mismatch in Partial
            }
        } catch (error) {
            console.error("Failed to save task", error);
            alert("שגיאה בשמירת המשימה");
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        if (!familyId || !window.confirm('האם למחוק את המשימה?')) return;
        try {
            await deleteTask(familyId, taskId);
        } catch (error) {
            console.error("Failed to delete task", error);
        }
    };

    const handleToggleStatus = async (task: Task) => {
        if (!familyId) return;
        try {
            await toggleTaskStatus(familyId, task.id, task.status);
        } catch (error) {
            console.error("Failed to toggle status", error);
        }
    };

    const getFilteredTasks = () => {
        if (!tasks) return [];

        switch (activeTab) {
            case 'todo':
                return tasks.filter(t => t.status === 'todo');
            case 'mine':
                return tasks.filter(t => t.status === 'todo' && user?.uid && t.assignees.includes(user.uid));
            case 'completed':
                return tasks.filter(t => t.status === 'done');
            default:
                return [];
        }
    };

    const getAssigneeMember = (uid: string) => {
        return members.find(m => m.uid === uid);
    };

    const filteredTasks = getFilteredTasks();

    if (tasksLoading) {
        return <div className="loading-container">טוען משימות...</div>;
    }

    return (
        <div className="tasks-page-container">
            <header className="tasks-header">
                <h1>המשימות שלנו</h1>
                <button className="add-task-btn" onClick={handleCreateTask}>
                    <Plus size={20} />
                    משימה חדשה
                </button>
            </header>

            <div className="tasks-tabs">
                <button
                    className={`tab-btn ${activeTab === 'todo' ? 'active' : ''}`}
                    onClick={() => setActiveTab('todo')}
                >
                    לביצוע
                </button>
                <button
                    className={`tab-btn ${activeTab === 'mine' ? 'active' : ''}`}
                    onClick={() => setActiveTab('mine')}
                >
                    שלי
                </button>
                <button
                    className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
                    onClick={() => setActiveTab('completed')}
                >
                    הושלמו
                </button>
            </div>

            <div className="tasks-list">
                {filteredTasks.length === 0 && (
                    <div className="empty-state">
                        אין משימות להצגה
                    </div>
                )}

                {filteredTasks.map(task => (
                    <div key={task.id} className={`task-item ${task.status === 'done' ? 'completed' : ''}`}>
                        <input
                            type="checkbox"
                            className="task-checkbox"
                            checked={task.status === 'done'}
                            onChange={() => handleToggleStatus(task)}
                        />

                        <div className="task-content">
                            <div className="task-title">{task.title}</div>
                            {task.description && <div className="task-description">{task.description}</div>}

                            <div className="task-meta">
                                {task.dueDate && (
                                    <div className="task-due-date" title="תאריך יעד">
                                        <Calendar size={14} />
                                        {new Date(task.dueDate.toDate()).toLocaleDateString('he-IL')}
                                    </div>
                                )}

                                {task.assignees.length > 0 && (
                                    <div className="task-assignee">
                                        {task.assignees.map(uid => {
                                            const member = getAssigneeMember(uid);
                                            if (!member) return null;
                                            return (
                                                <img
                                                    key={uid}
                                                    src={member.photoURL || `https://ui-avatars.com/api/?name=${member.displayName}&background=random`}
                                                    alt={member.displayName}
                                                    className="assignee-avatar"
                                                    title={member.displayName}
                                                />
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="task-actions">
                            <button className="action-btn" onClick={() => handleEditTask(task)} title="ערוך">
                                <Edit2 size={18} />
                            </button>
                            <button className="action-btn delete" onClick={() => handleDeleteTask(task.id)} title="מחק">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveTask}
                initialData={editingTask}
            />
        </div>
    );
};
