import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  UserX, 
  UserCheck, 
  Search, 
  Filter, 
  MoreVertical,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  AlertCircle,
  Calendar,
  Mail,
  Key
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { User, PaginatedUsers, CreateUserData, ApiResponse } from '../../types/auth';
import ApiKeyManagement from './ApiKeyManagement';

const AdminDashboard: React.FC = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    suspended: 0,
    admins: 0,
    regularUsers: 0,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    limit: 10,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDropdown, setShowDropdown] = useState<number | null>(null);

  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`/api${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  };

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        search: searchTerm,
        status: statusFilter,
        role: roleFilter,
      });

      const response: ApiResponse<PaginatedUsers> = await apiCall(`/admin/users?${queryParams}`);
      
      if (response.success && response.data) {
        setUsers(response.data.users);
        setStats(response.data.stats);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, statusFilter, roleFilter]);

  const handleCreateUser = async (userData: CreateUserData) => {
    try {
      await apiCall('/admin/users', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      
      setShowCreateModal(false);
      fetchUsers(pagination.currentPage);
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await apiCall(`/admin/users/${userId}`, { method: 'DELETE' });
      fetchUsers(pagination.currentPage);
      setShowDropdown(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete user');
    }
  };

  const handleSuspendUser = async (userId: number) => {
    try {
      await apiCall(`/admin/users/${userId}/suspend`, { method: 'PATCH' });
      fetchUsers(pagination.currentPage);
      setShowDropdown(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to suspend user');
    }
  };

  const handleActivateUser = async (userId: number) => {
    try {
      await apiCall(`/admin/users/${userId}/activate`, { method: 'PATCH' });
      fetchUsers(pagination.currentPage);
      setShowDropdown(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to activate user');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <Ban className="w-3 h-3 mr-1" />
            Suspended
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            {status}
          </span>
        );
    }
  };

  const getRoleBadge = (role: string) => {
    return role === 'admin' ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        Admin
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        User
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-8">
        {/* Header */}
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-bold text-primaryText">Admin Dashboard</h1>
            <p className="text-primaryText/60 mt-2">User management and system administration</p>
          </div>
          {activeTab === 'users' && (
            <div className="flex-shrink-0">
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-accent text-background rounded-lg hover:bg-accent/90 transition-colors w-full sm:w-auto justify-center"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create User</span>
              </button>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-border">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('users')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'users'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-primaryText/60 hover:text-primaryText hover:border-border'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>User Management</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('api-keys')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'api-keys'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-primaryText/60 hover:text-primaryText hover:border-border'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Key className="w-4 h-4" />
                  <span>API Keys</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'users' && (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primaryText/60 text-sm font-medium">Total Users</p>
                <p className="text-2xl font-bold text-primaryText">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 text-accent" />
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primaryText/60 text-sm font-medium">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primaryText/60 text-sm font-medium">Suspended</p>
                <p className="text-2xl font-bold text-red-600">{stats.suspended}</p>
              </div>
              <UserX className="w-8 h-8 text-red-600" />
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primaryText/60 text-sm font-medium">Admins</p>
                <p className="text-2xl font-bold text-blue-600">{stats.admins}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primaryText/60 text-sm font-medium">Regular Users</p>
                <p className="text-2xl font-bold text-purple-600">{stats.regularUsers}</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-card border border-border rounded-xl p-4 mb-6">
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primaryText/40 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg bg-background text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent min-w-0"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
              
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg bg-background text-primaryText focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent min-w-0"
              >
                <option value="all">All Roles</option>
                <option value="user">Users</option>
                <option value="admin">Admins</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

                {/* Users Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin"></div>
              <span className="text-primaryText/60 text-lg">Loading users...</span>
            </div>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Users className="w-16 h-16 text-primaryText/30 mb-4" />
            <h3 className="text-xl font-semibold text-primaryText mb-2">No users found</h3>
            <p className="text-primaryText/60 text-center max-w-md">
              {searchTerm || statusFilter !== 'all' || roleFilter !== 'all' 
                ? 'Try adjusting your search filters to find users.'
                : 'Get started by creating your first user account.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {users.map((user) => (
                             <div 
                 key={user.id} 
                 className="bg-card border border-border rounded-2xl p-5 hover:shadow-xl hover:shadow-black/10 transition-all duration-300 hover:scale-[1.02] group relative overflow-hidden"
               >
                 {/* Header with Avatar and Menu */}
                 <div className="flex items-start justify-between mb-4">
                   <div className="flex items-center space-x-3 flex-1 min-w-0">
                     <div className="flex-shrink-0">
                       <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center ring-2 ring-accent/20 group-hover:ring-accent/40 transition-all duration-300">
                         <span className="text-base font-bold text-accent">
                           {user.firstName[0]}{user.lastName[0]}
                         </span>
                       </div>
                     </div>
                     <div className="flex-1 min-w-0">
                       <h3 className="text-base font-bold text-primaryText truncate">
                         {user.firstName} {user.lastName}
                       </h3>
                       <div className="flex items-center text-xs text-primaryText/60 mt-0.5">
                         <Mail className="w-3 h-3 mr-1.5 flex-shrink-0" />
                         <span className="truncate">{user.email}</span>
                       </div>
                     </div>
                   </div>
                   
                   {/* Menu Button */}
                   <div className="relative flex-shrink-0">
                     <button
                       onClick={() => setShowDropdown(showDropdown === user.id ? null : user.id)}
                       className="p-1.5 rounded-lg hover:bg-background/50 transition-colors"
                     >
                       <MoreVertical className="w-4 h-4 text-primaryText/60" />
                     </button>
                     
                     {showDropdown === user.id && (
                       <>
                         <div 
                           className="fixed inset-0 z-10" 
                           onClick={() => setShowDropdown(null)}
                         ></div>
                         <div className="absolute right-0 top-full mt-1 w-44 bg-card border border-border rounded-xl shadow-xl shadow-black/20 z-20 overflow-hidden backdrop-blur-sm">
                           <div className="py-1">
                             {user.status === 'active' ? (
                               <button
                                 onClick={() => handleSuspendUser(user.id)}
                                 className="flex items-center space-x-2 w-full px-3 py-2 text-xs text-primaryText hover:bg-accent/10 hover:text-accent transition-all duration-200 text-left group"
                               >
                                 <Ban className="w-3 h-3 group-hover:scale-110 transition-transform" />
                                 <span className="font-medium">Suspend User</span>
                               </button>
                             ) : (
                               <button
                                 onClick={() => handleActivateUser(user.id)}
                                 className="flex items-center space-x-2 w-full px-3 py-2 text-xs text-primaryText hover:bg-green-500/10 hover:text-green-500 transition-all duration-200 text-left group"
                               >
                                 <CheckCircle className="w-3 h-3 group-hover:scale-110 transition-transform" />
                                 <span className="font-medium">Activate User</span>
                               </button>
                             )}
                             <div className="mx-2 my-1 h-px bg-border/50"></div>
                             <button
                               onClick={() => handleDeleteUser(user.id)}
                               className="flex items-center space-x-2 w-full px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 text-left group"
                             >
                               <Trash2 className="w-3 h-3 group-hover:scale-110 transition-transform" />
                               <span className="font-medium">Delete User</span>
                             </button>
                           </div>
                         </div>
                       </>
                     )}
                   </div>
                 </div>

                 {/* Role and Status Row */}
                 <div className="flex items-center justify-between mb-4">
                   {getRoleBadge(user.role)}
                   {getStatusBadge(user.status)}
                 </div>

                 {/* User Details */}
                 <div className="space-y-2.5 mb-5">
                   <div className="flex items-center justify-between text-xs">
                     <span className="text-primaryText/50 font-medium flex items-center">
                       <Calendar className="w-3 h-3 mr-1.5" />
                       Created
                     </span>
                     <span className="text-primaryText font-medium">
                       {new Date(user.createdAt).toLocaleDateString()}
                     </span>
                   </div>
                   
                   <div className="flex items-center justify-between text-xs">
                     <span className="text-primaryText/50 font-medium flex items-center">
                       <Calendar className="w-3 h-3 mr-1.5" />
                       Last Login
                     </span>
                     <span className="text-primaryText font-medium">
                       {user.lastLogin ? (
                         new Date(user.lastLogin).toLocaleDateString()
                       ) : (
                         <span className="text-primaryText/40 italic">Never</span>
                       )}
                     </span>
                   </div>
                 </div>

                 {/* Quick Actions */}
                 <div className="flex space-x-1.5">
                   {user.status === 'active' ? (
                     <button
                       onClick={() => handleSuspendUser(user.id)}
                       className="flex-1 flex items-center justify-center space-x-1.5 px-3 py-2.5 text-xs bg-orange-500/10 text-orange-400 rounded-lg hover:bg-orange-500/20 transition-all duration-200 font-semibold"
                     >
                       <Ban className="w-3.5 h-3.5" />
                       <span>Suspend</span>
                     </button>
                   ) : (
                     <button
                       onClick={() => handleActivateUser(user.id)}
                       className="flex-1 flex items-center justify-center space-x-1.5 px-3 py-2.5 text-xs bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-all duration-200 font-semibold"
                     >
                       <CheckCircle className="w-3.5 h-3.5" />
                       <span>Activate</span>
                     </button>
                   )}
                   <button
                     onClick={() => handleDeleteUser(user.id)}
                     className="flex items-center justify-center px-3 py-2.5 text-xs bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all duration-200 group"
                   >
                     <Trash2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                   </button>
                 </div>
               </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-primaryText/60">
              Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.currentPage * pagination.limit, pagination.totalUsers)} of{' '}
              {pagination.totalUsers} results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => fetchUsers(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="px-3 py-1 text-sm border border-border rounded-lg hover:bg-background/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm bg-accent text-background rounded-lg">
                {pagination.currentPage}
              </span>
              <button
                onClick={() => fetchUsers(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-3 py-1 text-sm border border-border rounded-lg hover:bg-background/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Create User Modal */}
        {showCreateModal && (
          <CreateUserModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateUser}
          />
        )}
        </>
      )}

      {/* API Key Management */}
      {activeTab === 'api-keys' && (
        <ApiKeyManagement />
      )}
      </div>
    </div>
  );
};

// Create User Modal Component
interface CreateUserModalProps {
  onClose: () => void;
  onSubmit: (userData: CreateUserData) => Promise<void>;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState<CreateUserData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'user',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit(formData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl p-6 w-full max-w-md border border-border shadow-2xl shadow-black/25">
        <h2 className="text-2xl font-bold text-primaryText mb-6 text-center">Create New User</h2>
        
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-300 text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-primaryText mb-2">
                First Name
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                className="w-full px-4 py-3 border border-border rounded-xl bg-background text-primaryText focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primaryText mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                className="w-full px-4 py-3 border border-border rounded-xl bg-background text-primaryText focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-200"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-primaryText mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-3 border border-border rounded-xl bg-background text-primaryText focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-primaryText mb-2">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="w-full px-4 py-3 border border-border rounded-xl bg-background text-primaryText focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-200"
              minLength={6}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-primaryText mb-2">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'user' | 'admin' }))}
              className="w-full px-4 py-3 border border-border rounded-xl bg-background text-primaryText focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-200"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-primaryText/60 hover:text-primaryText transition-colors font-medium rounded-xl hover:bg-background/50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-accent to-accent/80 text-background rounded-xl hover:from-accent/90 hover:to-accent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 font-semibold shadow-lg hover:shadow-xl hover:scale-105"
            >
              {loading && <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin"></div>}
              <span>{loading ? 'Creating...' : 'Create User'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard; 