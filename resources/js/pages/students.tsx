import { Head } from '@inertiajs/react';
import { Trash2, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';

interface Student {
    id: number;
    first_name: string;
    last_name: string;
    email?: string;
    program?: string;
    gender?: string;
    birthday?: string;
    address?: string;
    number?: string;
    yr_level?: string;
    created_at?: string;
    updated_at?: string;
    [key: string]: any;
}

interface FormData {
    first_name: string;
    last_name: string;
    email: string;
    program: string;
    gender: string;
    birthday: string;
    address: string;
    number: string;
    yr_level: string;
}

const initialFormData: FormData = {
    first_name: '',
    last_name: '',
    email: '',
    program: 'BSIS',
    gender: 'male',
    birthday: '',
    address: '',
    number: '',
    yr_level: '1',
};

export default function Students() {
    const [studentsList, setStudentsList] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchType, setSearchType] = useState<'name' | 'id' | 'program' | 'year'>('name');
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState<number | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState<number | null>(null);
    const itemsPerPage = 10;

    const fetchStudents = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch('/api/students');

            if (!response.ok) {
                throw new Error('Failed to fetch students');
            }

            const data = await response.json();
            setStudentsList(data);
            setCurrentPage(1);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchStudents();
    }, []);

    const handleAddStudent = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setSubmitting(true);
            setError(null);
            const response = await fetch('/api/students', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            
            if (!response.ok) {
                const errorData = await response.json();

                throw new Error(errorData.message || 'Failed to add student');
            }
            
            const newStudent = await response.json();
            setStudentsList([...studentsList, newStudent]);
            setFormData(initialFormData);
            setShowAddModal(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteStudent = (id: number) => {
        setStudentToDelete(id);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (!studentToDelete) {
return;
}
        
        try {
            setDeleting(studentToDelete);
            setError(null);
            const response = await fetch(`/api/students/${studentToDelete}`, {
                method: 'DELETE',
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete student');
            }
            
            setStudentsList(studentsList.filter(s => s.id !== studentToDelete));
            setShowModal(false);
            setShowDeleteConfirm(false);
            setStudentToDelete(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setDeleting(null);
        }
    };

    const filteredStudents = studentsList.filter((student) => {
        if (!searchQuery.trim()) {
return true;
}
        
        const query = searchQuery.toLowerCase();

        switch (searchType) {
            case 'name':
                return (
                    `${student.first_name} ${student.last_name}`.toLowerCase().includes(query)
                );
            case 'id':
                return student.id.toString().includes(query);
            case 'program':
                return (student.program || '').toLowerCase().includes(query);
            case 'year':
                return (student.yr_level || '').toLowerCase().includes(query);
            default:
                return true;
        }
    });

    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentStudents = filteredStudents.slice(startIndex, endIndex);

    return (
        <>
            <Head title="Students" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-auto rounded-xl p-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Students</h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Showing {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={() => setShowAddModal(true)} className="gap-2" disabled={submitting}>
                            <Plus className="h-4 w-4" />
                            Add Student
                        </Button>
                        <Button onClick={fetchStudents} disabled={loading}>
                            {loading ? (
                                <>
                                    <Spinner className="mr-2 h-4 w-4" />
                                    Loading...
                                </>
                            ) : (
                                'Refresh'
                            )}
                        </Button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="flex gap-2 rounded-lg border border-sidebar-border/70 bg-gray-50 p-3 dark:border-sidebar-border dark:bg-gray-900/50">
                    <select
                        value={searchType}
                        onChange={(e) => {
                            setSearchType(e.target.value as 'name' | 'id' | 'program' | 'year');
                            setCurrentPage(1);
                        }}
                        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800"
                    >
                        <option value="name">Name</option>
                        <option value="id">ID</option>
                        <option value="program">Program</option>
                        <option value="year">Year Level</option>
                    </select>
                    <Input
                        type="text"
                        placeholder={`Search by ${searchType === 'name' ? 'first or last name' : searchType === 'id' ? 'ID number' : searchType === 'program' ? 'program' : 'year level'}...`}
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="flex-1"
                    />
                </div>

                {error && (
                    <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-800 dark:border-red-700 dark:bg-red-900 dark:text-red-100">
                        {error}
                    </div>
                )}

                {loading ? (
                    <Card className="flex items-center justify-center p-12">
                        <Spinner className="h-8 w-8" />
                    </Card>
                ) : currentStudents.length === 0 ? (
                    <Card className="flex items-center justify-center p-12">
                        <p className="text-gray-500">No students found</p>
                    </Card>
                ) : (
                    <>
                        {/* Student Cards - Horizontal Line */}
                        <div className="space-y-3">
                            {currentStudents.map((student) => (
                                <Card
                                    key={student.id}
                                    onClick={() => {
                                        setSelectedStudent(student);
                                        setShowModal(true);
                                    }}
                                    className="cursor-pointer border border-sidebar-border/70 p-4 transition-all hover:border-blue-400 hover:shadow-md dark:border-sidebar-border dark:hover:border-blue-400"
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="font-semibold text-gray-900 dark:text-white">
                                                {student.first_name} {student.last_name}
                                            </div>
                                            <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
                                                <span className="font-mono">ID: {student.id}</span>
                                                <span>{student.email}</span>
                                                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-900 dark:bg-blue-900 dark:text-blue-100">
                                                    {student.program || 'N/A'}
                                                </span>
                                                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-900 dark:bg-green-900 dark:text-green-100">
                                                    Year {student.yr_level || 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline">
                                                View Details
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteStudent(student.id);
                                                }}
                                                disabled={deleting === student.id}
                                            >
                                                {deleting === student.id ? (
                                                    <Spinner className="h-4 w-4" />
                                                ) : (
                                                    <Trash2 className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between gap-4 rounded-lg border border-sidebar-border/70 bg-gray-50 p-4 dark:border-sidebar-border dark:bg-gray-900/50">
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Page {currentPage} of {totalPages}
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => setCurrentPage(1)}
                                        disabled={currentPage === 1 || loading}
                                        variant="outline"
                                        size="sm"
                                    >
                                        First
                                    </Button>
                                    <Button
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1 || loading}
                                        variant="outline"
                                        size="sm"
                                    >
                                        Previous
                                    </Button>
                                    <div className="flex gap-1">
                                        {(() => {
                                            const pages = [];
                                            const maxButtons = 5;
                                            let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
                                            const endPage = Math.min(totalPages, startPage + maxButtons - 1);
                                            
                                            if (endPage - startPage < maxButtons - 1) {
                                                startPage = Math.max(1, endPage - maxButtons + 1);
                                            }
                                            
                                            if (startPage > 1) {
                                                pages.push(1);

                                                if (startPage > 2) {
pages.push('...');
}
                                            }
                                            
                                            for (let i = startPage; i <= endPage; i++) {
                                                pages.push(i);
                                            }
                                            
                                            if (endPage < totalPages) {
                                                if (endPage < totalPages - 1) {
pages.push('...');
}

                                                pages.push(totalPages);
                                            }
                                            
                                            return pages.map((page, index) => (
                                                page === '...' ? (
                                                    <span key={index} className="px-2 py-1 text-gray-500">
                                                        •••
                                                    </span>
                                                ) : (
                                                    <Button
                                                        key={page}
                                                        onClick={() => setCurrentPage(page as number)}
                                                        variant={currentPage === page ? 'default' : 'outline'}
                                                        size="sm"
                                                    >
                                                        {page}
                                                    </Button>
                                                )
                                            ));
                                        })()}
                                    </div>
                                    <Button
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages || loading}
                                        variant="outline"
                                        size="sm"
                                    >
                                        Next
                                    </Button>
                                    <Button
                                        onClick={() => setCurrentPage(totalPages)}
                                        disabled={currentPage === totalPages || loading}
                                        variant="outline"
                                        size="sm"
                                    >
                                        Last
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Student Details Modal */}
                {selectedStudent && (
                    <Dialog open={showModal} onOpenChange={setShowModal}>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>Student Details</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4">
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="text-sm font-semibold text-gray-600">ID:</div>
                                    <div className="text-sm">{selectedStudent.id}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="text-sm font-semibold text-gray-600">First Name:</div>
                                    <div className="text-sm">{selectedStudent.first_name || 'N/A'}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="text-sm font-semibold text-gray-600">Last Name:</div>
                                    <div className="text-sm">{selectedStudent.last_name || 'N/A'}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="text-sm font-semibold text-gray-600">Email:</div>
                                    <div className="text-sm">{selectedStudent.email || 'N/A'}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="text-sm font-semibold text-gray-600">Gender:</div>
                                    <div className="text-sm">{selectedStudent.gender || 'N/A'}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="text-sm font-semibold text-gray-600">Birthday:</div>
                                    <div className="text-sm">{selectedStudent.birthday || 'N/A'}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="text-sm font-semibold text-gray-600">Address:</div>
                                    <div className="text-sm">{selectedStudent.address || 'N/A'}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="text-sm font-semibold text-gray-600">Phone:</div>
                                    <div className="text-sm">{selectedStudent.number || 'N/A'}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="text-sm font-semibold text-gray-600">Program:</div>
                                    <div className="text-sm">{selectedStudent.program || 'N/A'}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="text-sm font-semibold text-gray-600">Year Level:</div>
                                    <div className="text-sm">{selectedStudent.yr_level || 'N/A'}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="text-sm font-semibold text-gray-600">Created:</div>
                                    <div className="text-sm">
                                        {selectedStudent.created_at
                                            ? new Date(selectedStudent.created_at).toLocaleDateString()
                                            : 'N/A'}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 pt-4">
                                <Button
                                    variant="destructive"
                                    onClick={() => selectedStudent.id && handleDeleteStudent(selectedStudent.id)}
                                    disabled={deleting !== null}
                                    className="flex-1"
                                >
                                    {deleting ? <Spinner className="mr-2 h-4 w-4" /> : <Trash2 className="mr-2 h-4 w-4" />}
                                    Delete Student
                                </Button>
                                <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">
                                    Close
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}

                {/* Add Student Modal */}
                <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Add New Student</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddStudent} className="grid gap-4">
                            <div>
                                <label className="text-sm font-medium">First Name *</label>
                                <Input
                                    required
                                    value={formData.first_name}
                                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                    placeholder="First name"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Last Name *</label>
                                <Input
                                    required
                                    value={formData.last_name}
                                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                    placeholder="Last name"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Email *</label>
                                <Input
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="Email"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Gender *</label>
                                <select
                                    required
                                    value={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800"
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Birthday *</label>
                                <Input
                                    required
                                    type="date"
                                    value={formData.birthday}
                                    onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Address *</label>
                                <Input
                                    required
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="Address"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Phone Number *</label>
                                <Input
                                    required
                                    value={formData.number}
                                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                                    placeholder="Phone number"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Program *</label>
                                <select
                                    required
                                    value={formData.program}
                                    onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800"
                                >
                                    <option value="BSIS">BSIS</option>
                                    <option value="BSCS">BSCS</option>
                                    <option value="BSIT">BSIT</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Year Level *</label>
                                <select
                                    required
                                    value={formData.yr_level}
                                    onChange={(e) => setFormData({ ...formData, yr_level: e.target.value })}
                                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800"
                                >
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                </select>
                            </div>
                            {error && (
                                <div className="rounded bg-red-100 p-2 text-sm text-red-700">
                                    {error}
                                </div>
                            )}
                            <div className="flex gap-2 pt-4">
                                <Button type="submit" disabled={submitting} className="flex-1">
                                    {submitting ? <Spinner className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                                    Add Student
                                </Button>
                                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                    <DialogContent className="max-w-sm">
                        <DialogHeader>
                            <DialogTitle>Delete Student</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Are you sure you want to delete this student? This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex gap-2 pt-4">
                            <Button
                                variant="destructive"
                                onClick={confirmDelete}
                                disabled={deleting !== null}
                                className="flex-1"
                            >
                                {deleting ? <Spinner className="mr-2 h-4 w-4" /> : <Trash2 className="mr-2 h-4 w-4" />}
                                Delete
                            </Button>
                            <Button 
                                variant="outline" 
                                onClick={() => {
                                    setShowDeleteConfirm(false);
                                    setStudentToDelete(null);
                                }} 
                                className="flex-1"
                                disabled={deleting !== null}
                            >
                                Cancel
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}

Students.layout = {
    breadcrumbs: [
        {
            title: 'Students',
            href: '/students',
        },
    ],
};
