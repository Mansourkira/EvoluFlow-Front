"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  Plus,
  Search,
  Download,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Mail,
  FileText,
  FileSpreadsheet,
  Filter,
  RefreshCw,
} from "lucide-react"
import { useUsers } from "@/hooks/useAuth"

export default function UsersPage() {
  // Use custom hook to fetch users from API
  const { users, isLoading, error, refetch } = useUsers()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "User",
    status: "Active",
  })

  const itemsPerPage = 5

  // Filter users based on search term and role
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.profilLabel === roleFilter

    return matchesSearch && matchesRole
  })

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage)

  const handleAddUser = () => {
    if (newUser.name && newUser.email) {
      // TODO: Implement API call to add user
      console.log('Adding user:', newUser)
      setNewUser({ name: "", email: "", role: "User", status: "Active" })
      setIsAddUserOpen(false)
      // Refresh users list after adding
      refetch()
    }
  }

  const handleDeleteClick = (email: string) => {
    setUserToDelete(email)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return

    setIsDeleting(true)
    try {
      const response = await fetch('http://localhost:3000/api/v1/users/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ E_mail: userToDelete }),
      })

      if (response.ok) {
        toast({
          title: 'Succès',
          description: 'Utilisateur supprimé avec succès'
        })
        refetch() // Refresh the users list
      } else {
        const errorData = await response.json().catch(() => ({}))
        toast({
          title: 'Erreur',
          description: errorData.message || 'Erreur lors de la suppression',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Delete user error:', error)
      toast({
        title: 'Erreur',
        description: 'Erreur de connexion au serveur',
        variant: 'destructive'
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setUserToDelete(null)
    }
  }

  const handleExport = (format: string) => {
    // In a real application, you would implement actual export functionality
    console.log(`Exporting users as ${format}`)
    alert(`Exporting users as ${format} - Feature would be implemented with actual export logic`)
  }

  const handleSendEmail = (email: string) => {
    window.location.href = `mailto:${email}`
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground">Manage your users and their permissions</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Refresh Button */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>

            {/* Export Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport("PDF")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("Excel")}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export as Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("Word")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export as Word
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Add User Button */}
            <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>
                    Create a new user account. Fill in the required information below.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Administratif">Administratif</SelectItem>
                        <SelectItem value="Consultant">Consultant</SelectItem>
                        <SelectItem value="Prospect ou visiteur">Prospect ou visiteur</SelectItem>
                        <SelectItem value="Candidat">Candidat</SelectItem>
                        <SelectItem value="Professeur">Professeur</SelectItem>
                        <SelectItem value="Direction">Direction</SelectItem>
                        <SelectItem value="Financier">Financier</SelectItem>
                        <SelectItem value="Organisme">Organisme</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddUser}>Add User</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Administratif">Administratif</SelectItem>
                <SelectItem value="Consultant">Consultant</SelectItem>
                <SelectItem value="Prospect ou visiteur">Prospect ou visiteur</SelectItem>
                <SelectItem value="Candidat">Candidat</SelectItem>
                <SelectItem value="Professeur">Professeur</SelectItem>
                <SelectItem value="Direction">Direction</SelectItem>
                <SelectItem value="Financier">Financier</SelectItem>
                <SelectItem value="Organisme">Organisme</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
            <div className="flex items-center gap-2">
              <span>{error}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => refetch()}
                className="ml-auto"
              >
                Réessayer
              </Button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3A90DA]"></div>
            <span className="ml-2 text-gray-600">Chargement des utilisateurs...</span>
          </div>
        )}

        {/* Users Table */}
        {!isLoading && !error && (
          <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-900">Name</TableHead>
                  <TableHead className="font-semibold text-gray-900">Email</TableHead>
                  <TableHead className="font-semibold text-gray-900">Role</TableHead>
                  <TableHead className="font-semibold text-gray-900">Join Date</TableHead>
                  <TableHead className="text-center font-semibold text-gray-900">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium py-4">{user.name}</TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">{user.email}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSendEmail(user.email)}
                          className="h-7 w-7 p-0 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                          title="Send email"
                        >
                          <Mail className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge
                        variant={
                          user.profilLabel === "Administratif" 
                            ? "default" 
                            : user.profilLabel === "Consultant" 
                            ? "secondary" 
                            : "outline"
                        }
                        className="font-medium"
                      >
                        {user.profilLabel}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 text-gray-600">{user.joinDate}</TableCell>
                    <TableCell className="py-4">
                      <div className="flex justify-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                          title="View user"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 hover:bg-green-100 hover:text-green-600 transition-colors"
                          title="Edit user"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 transition-colors"
                          onClick={() => handleDeleteClick(user.email)}
                          title="Delete user"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !error && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of{" "}
              {filteredUsers.length} users
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
                <br />
                <span className="font-medium text-gray-900 mt-2 block">
                  Email: {userToDelete}
                </span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel 
                onClick={() => setDeleteDialogOpen(false)}
                disabled={isDeleting}
              >
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Suppression...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
