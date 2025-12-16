'use client'

import { useState, useEffect } from 'react'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'
import { apiRequest } from '@/lib/api'
import { Task, TaskRequest } from '@/types'

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <DashboardContent />
        </ProtectedRoute>
    )
}

function DashboardContent() {
    const { user, logout } = useAuth()
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState<TaskRequest>({
        title: '',
        description: '',
        status: 'pending',
    })
    const [editingTask, setEditingTask] = useState<Task | null>(null)
    const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all')

    useEffect(() => {
        loadTasks()
    }, [])

    const loadTasks = async () => {
        try {
        setLoading(true)
        const data = await apiRequest<{ tasks: Task[] }>('/api/tasks')
        setTasks(data.tasks)
        } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar tarefas')
        } finally {
        setLoading(false)
        }
    }

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
        const data = await apiRequest<{ task: Task }>('/api/tasks', {
            method: 'POST',
            body: JSON.stringify(formData),
        })
        setTasks([data.task, ...tasks])
        setFormData({ title: '', description: '', status: 'pending' })
        setShowForm(false)
        setError('')
        } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao criar tarefa')
        }
    }

    const handleUpdateTask = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingTask) return

        try {
        const data = await apiRequest<{ task: Task }>(`/api/tasks/${editingTask.id}`, {
            method: 'PUT',
            body: JSON.stringify(formData),
        })
        setTasks(tasks.map((t) => (t.id === editingTask.id ? data.task : t)))
        setEditingTask(null)
        setFormData({ title: '', description: '', status: 'pending' })
        setError('')
        } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao atualizar tarefa')
        }
    }

    const handleDeleteTask = async (id: number) => {
        if (!confirm('Tem certeza que deseja deletar esta tarefa?')) return

        try {
        await apiRequest(`/api/tasks/${id}`, { method: 'DELETE' })
        setTasks(tasks.filter((t) => t.id !== id))
        setError('')
        } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao deletar tarefa')
        }
    }

    const startEdit = (task: Task) => {
        setEditingTask(task)
        setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        })
        setShowForm(true)
    }

    const cancelEdit = () => {
        setEditingTask(null)
        setFormData({ title: '', description: '', status: 'pending' })
        setShowForm(false)
    }

    const filteredTasks = tasks.filter((task) => {
        if (filter === 'all') return true
        return task.status === filter
    })

    const getStatusColor = (status: string) => {
        switch (status) {
        case 'completed':
            return 'bg-green-100 text-green-800'
        case 'in_progress':
            return 'bg-yellow-100 text-yellow-800'
        default:
            return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
        case 'completed':
            return 'Concluída'
        case 'in_progress':
            return 'Em Progresso'
        default:
            return 'Pendente'
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                    <h1 className="text-xl font-semibold">Hubfy Task Manager</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                    <span className="text-gray-700">Olá, {user?.name}</span>
                    <button
                        onClick={logout}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
                    >
                        Sair
                    </button>
                    </div>
                </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                    </div>
                )}

                <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">Minhas Tarefas</h2>
                    <button
                    onClick={() => {
                        cancelEdit()
                        setShowForm(!showForm)
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm"
                    >
                    {showForm ? 'Cancelar' : 'Nova Tarefa'}
                    </button>
                </div>

                {showForm && (
                    <div className="mb-6 bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-4">
                        {editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
                    </h3>
                    <form onSubmit={editingTask ? handleUpdateTask : handleCreateTask}>
                        <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Título</label>
                            <input
                            type="text"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Descrição</label>
                            <textarea
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <select
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                            value={formData.status}
                            onChange={(e) =>
                                setFormData({
                                ...formData,
                                status: e.target.value as 'pending' | 'in_progress' | 'completed',
                                })
                            }
                            >
                            <option value="pending">Pendente</option>
                            <option value="in_progress">Em Progresso</option>
                            <option value="completed">Concluída</option>
                            </select>
                        </div>
                        <div className="flex space-x-2">
                            <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm"
                            >
                            {editingTask ? 'Atualizar' : 'Criar'}
                            </button>
                            {editingTask && (
                            <button
                                type="button"
                                onClick={cancelEdit}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md text-sm"
                            >
                                Cancelar
                            </button>
                            )}
                        </div>
                        </div>
                    </form>
                    </div>
                )}

                <div className="mb-4">
                    <div className="flex space-x-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-md text-sm ${
                        filter === 'all'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        Todas
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-4 py-2 rounded-md text-sm ${
                        filter === 'pending'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        Pendentes
                    </button>
                    <button
                        onClick={() => setFilter('in_progress')}
                        className={`px-4 py-2 rounded-md text-sm ${
                        filter === 'in_progress'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        Em Progresso
                    </button>
                    <button
                        onClick={() => setFilter('completed')}
                        className={`px-4 py-2 rounded-md text-sm ${
                        filter === 'completed'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        Concluídas
                    </button>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-8">Carregando tarefas...</div>
                ) : filteredTasks.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                    Nenhuma tarefa encontrada
                    </div>
                ) : (
                    <div className="grid gap-4">
                    {filteredTasks.map((task) => (
                        <div key={task.id} className="bg-white shadow rounded-lg p-6">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                            {task.description && (
                                <p className="mt-2 text-sm text-gray-600">{task.description}</p>
                            )}
                            <div className="mt-4 flex items-center space-x-4">
                                <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                    task.status
                                )}`}
                                >
                                {getStatusLabel(task.status)}
                                </span>
                                <span className="text-xs text-gray-500">
                                Criada em: {new Date(task.created_at).toLocaleDateString('pt-BR')}
                                </span>
                            </div>
                            </div>
                            <div className="flex space-x-2">
                            <button
                                onClick={() => startEdit(task)}
                                className="text-indigo-600 hover:text-indigo-900 text-sm"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => handleDeleteTask(task.id)}
                                className="text-red-600 hover:text-red-900 text-sm"
                            >
                                Deletar
                            </button>
                            </div>
                        </div>
                        </div>
                    ))}
                    </div>
                )}
                </div>
            </div>
        </div>
    )
}

