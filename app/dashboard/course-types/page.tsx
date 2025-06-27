"use client";

import { useEffect, useState } from "react";
import { useCourseTypes } from "@/hooks/useCourseTypes";
import { CourseType, getPriorityLabel, getPriorityColor } from "@/schemas/courseTypeSchema";
import { AddCourseTypeDialog } from "@/components/course-types/AddCourseTypeDialog";
import { UpdateCourseTypeDialog } from "@/components/course-types/UpdateCourseTypeDialog";
import { ViewCourseTypeDialog } from "@/components/course-types/ViewCourseTypeDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  BookOpen,
  Search,
  Eye,
  Edit,
  Trash2,
  User,
  Flag,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Filter,
  X,
  Loader2,
  Mail,
  RefreshCw,
  Columns,
  Plus,
  MoreHorizontal,
} from "lucide-react";

type SortField = 'Reference' | 'Libelle' | 'Priorite' | 'Nom_Prenom' | 'Heure';
type SortDirection = 'asc' | 'desc' | null;

interface FieldFilters {
  Reference: string;
  Libelle: string;
  Priorite: string;
  Utilisateur: string;
}

interface ColumnVisibility {
  Reference: boolean;
  Libelle: boolean;
  Priorite: boolean;
  Nom_Prenom: boolean;
  Heure: boolean;
}

export default function CourseTypesPage() {
  const { courseTypes, isLoading, fetchCourseTypes, deleteCourseType } = useCourseTypes();
  const { toast } = useToast();
  
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourseTypes, setSelectedCourseTypes] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>('Reference');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [fieldFilters, setFieldFilters] = useState<FieldFilters>({
    Reference: "",
    Libelle: "",
    Priorite: "",
    Utilisateur: "",
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    Reference: true,
    Libelle: true,
    Priorite: true,
    Nom_Prenom: true,
    Heure: true,
  });

  // Dialog states
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedCourseType, setSelectedCourseType] = useState<CourseType | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseTypeToDelete, setCourseTypeToDelete] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchCourseTypes();
  }, [fetchCourseTypes]);

  // Filtering and sorting logic
  const filteredAndSortedCourseTypes = courseTypes
    .filter(courseType => {
      const matchesSearch = !searchTerm || 
        courseType.Reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        courseType.Libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (courseType.Nom_Prenom && courseType.Nom_Prenom.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesFilters = 
        (!fieldFilters.Reference || courseType.Reference.toLowerCase().includes(fieldFilters.Reference.toLowerCase())) &&
        (!fieldFilters.Libelle || courseType.Libelle.toLowerCase().includes(fieldFilters.Libelle.toLowerCase())) &&
        (!fieldFilters.Priorite || (courseType.Priorite && courseType.Priorite.toString() === fieldFilters.Priorite)) &&
        (!fieldFilters.Utilisateur || (courseType.Nom_Prenom && courseType.Nom_Prenom.toLowerCase().includes(fieldFilters.Utilisateur.toLowerCase())));

      return matchesSearch && matchesFilters;
    })
    .sort((a, b) => {
      if (!sortDirection) return 0;
      
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];
      
      if (aValue == null) aValue = '';
      if (bValue == null) bValue = '';
      
      aValue = aValue.toString().toLowerCase();
      bValue = bValue.toString().toLowerCase();
      
      if (sortDirection === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedCourseTypes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCourseTypes = filteredAndSortedCourseTypes.slice(startIndex, endIndex);

  // Handlers
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : sortDirection === 'desc' ? null : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    if (sortDirection === 'asc') return <ChevronUp className="h-4 w-4" />;
    if (sortDirection === 'desc') return <ChevronDown className="h-4 w-4" />;
    return null;
  };

  const toggleColumnVisibility = (column: keyof ColumnVisibility) => {
    setColumnVisibility(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCourseTypes(paginatedCourseTypes.map(ct => ct.Reference));
    } else {
      setSelectedCourseTypes([]);
    }
  };

  const handleSelectCourseType = (reference: string, checked: boolean) => {
    if (checked) {
      setSelectedCourseTypes(prev => [...prev, reference]);
    } else {
      setSelectedCourseTypes(prev => prev.filter(ref => ref !== reference));
    }
  };

  const clearSelection = () => {
    setSelectedCourseTypes([]);
  };

  const handleViewClick = (courseType: CourseType) => {
    setSelectedCourseType(courseType);
    setViewDialogOpen(true);
  };

  const handleEditClick = (courseType: CourseType) => {
    setSelectedCourseType(courseType);
    setUpdateDialogOpen(true);
  };

  const handleDeleteClick = (reference: string) => {
    setCourseTypeToDelete(reference);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const success = await deleteCourseType(courseTypeToDelete);
      if (success) {
        toast({
          title: "✅ Succès",
          description: "Type de cours supprimé avec succès",
        });
        setDeleteDialogOpen(false);
        setCourseTypeToDelete("");
        fetchCourseTypes();
      } else {
        toast({
          title: "❌ Erreur",
          description: "Erreur lors de la suppression du type de cours",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "❌ Erreur",
        description: "Erreur lors de la suppression du type de cours",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const updateFieldFilter = (field: keyof FieldFilters, value: string) => {
    setFieldFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setFieldFilters({
      Reference: "",
      Libelle: "",
      Priorite: "",
      Utilisateur: "",
    });
    setCurrentPage(1);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (fieldFilters.Reference) count++;
    if (fieldFilters.Libelle) count++;
    if (fieldFilters.Priorite) count++;
    if (fieldFilters.Utilisateur) count++;
    return count;
  };

  const handleItemsPerPageChange = (value: string) => {
    const newItemsPerPage = parseInt(value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-[#3A90DA]" />
              Types de Cours
            </h1>
            <p className="text-gray-600">
              Gérez les types de cours de votre système
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <AddCourseTypeDialog onCourseTypeAdded={fetchCourseTypes} />
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par référence, libellé ou responsable..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Actions Toolbar */}
            <div className="flex flex-wrap gap-2">
              {/* Filtres avancés */}
              <Button
                variant="outline"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filtres
                {getActiveFiltersCount() > 0 && (
                  <Badge variant="destructive" className="ml-1 px-1.5 py-0.5 text-xs">
                    {getActiveFiltersCount()}
                  </Badge>
                )}
              </Button>

              {/* Réinitialiser filtres */}
              {getActiveFiltersCount() > 0 && (
                <Button
                  variant="outline"
                  onClick={clearAllFilters}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Effacer
                </Button>
              )}

              {/* Refresh */}
              <Button
                variant="outline"
                onClick={() => fetchCourseTypes()}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Actualiser
              </Button>

              {/* Colonnes visibles */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Columns className="h-4 w-4" />
                    Colonnes
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {Object.entries(columnVisibility).map(([key, visible]) => (
                    <DropdownMenuItem
                      key={key}
                      onClick={() => toggleColumnVisibility(key as keyof ColumnVisibility)}
                    >
                      <Checkbox
                        checked={visible}
                        className="mr-2"
                      />
                      {key === 'Reference' && 'Référence'}
                      {key === 'Libelle' && 'Libellé'}
                      {key === 'Priorite' && 'Priorité'}
                      {key === 'Nom_Prenom' && 'Responsable'}
                      {key === 'Heure' && 'Dernière Modif.'}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Filtres avancés */}
          {showAdvancedFilters && (
            <div className="border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Référence</label>
                  <Input
                    placeholder="Filtrer par référence"
                    value={fieldFilters.Reference}
                    onChange={(e) => updateFieldFilter('Reference', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Libellé</label>
                  <Input
                    placeholder="Filtrer par libellé"
                    value={fieldFilters.Libelle}
                    onChange={(e) => updateFieldFilter('Libelle', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priorité</label>
                  <Select
                    value={fieldFilters.Priorite || "all"}
                    onValueChange={(value) => updateFieldFilter('Priorite', value === "all" ? "" : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrer par priorité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les priorités</SelectItem>
                      <SelectItem value="1">Faible</SelectItem>
                      <SelectItem value="2">Moyenne</SelectItem>
                      <SelectItem value="3">Élevée</SelectItem>
                      <SelectItem value="4">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
                  <Input
                    placeholder="Filtrer par responsable"
                    value={fieldFilters.Utilisateur}
                    onChange={(e) => updateFieldFilter('Utilisateur', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions en lot */}
        {selectedCourseTypes.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">
                  {selectedCourseTypes.length} type(s) de cours sélectionné(s)
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSelection}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-lg shadow">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-[#3A90DA]" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={paginatedCourseTypes.length > 0 && selectedCourseTypes.length === paginatedCourseTypes.length}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      {columnVisibility.Reference && (
                        <TableHead 
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => handleSort('Reference')}
                        >
                          <div className="flex items-center gap-1">
                            Référence
                            {renderSortIcon('Reference')}
                          </div>
                        </TableHead>
                      )}
                      {columnVisibility.Libelle && (
                        <TableHead 
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => handleSort('Libelle')}
                        >
                          <div className="flex items-center gap-1">
                            Libellé
                            {renderSortIcon('Libelle')}
                          </div>
                        </TableHead>
                      )}
                      {columnVisibility.Priorite && (
                        <TableHead 
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => handleSort('Priorite')}
                        >
                          <div className="flex items-center gap-1">
                            Priorité
                            {renderSortIcon('Priorite')}
                          </div>
                        </TableHead>
                      )}
                    
                      {columnVisibility.Heure && (
                        <TableHead 
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => handleSort('Heure')}
                        >
                          <div className="flex items-center gap-1">
                            Dernière Modif.
                            {renderSortIcon('Heure')}
                          </div>
                        </TableHead>
                      )}
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedCourseTypes.map((courseType) => (
                      <TableRow key={courseType.Reference} className="hover:bg-gray-50">
                        <TableCell>
                          <Checkbox
                            checked={selectedCourseTypes.includes(courseType.Reference)}
                            onCheckedChange={(checked) => 
                              handleSelectCourseType(courseType.Reference, checked as boolean)
                            }
                          />
                        </TableCell>
                        {columnVisibility.Reference && (
                          <TableCell className="font-medium">
                            {courseType.Reference}
                          </TableCell>
                        )}
                        {columnVisibility.Libelle && (
                          <TableCell>
                            <div className="max-w-xs">
                              <div className="font-medium text-gray-900">{courseType.Libelle}</div>
                            </div>
                          </TableCell>
                        )}
                        {columnVisibility.Priorite && (
                          <TableCell>
                            {courseType.Priorite && (
                              <Badge 
                                variant="outline" 
                                className={`${getPriorityColor(courseType.Priorite)} text-white border-0`}
                              >
                                <Flag className="h-3 w-3 mr-1" />
                                {getPriorityLabel(courseType.Priorite)}
                              </Badge>
                            )}
                          </TableCell>
                        )}
             
                        {columnVisibility.Heure && (
                          <TableCell>
                            {courseType.Heure ? new Date(courseType.Heure).toLocaleDateString('fr-FR') : '-'}
                          </TableCell>
                        )}
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewClick(courseType)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Consulter
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditClick(courseType)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteClick(courseType.Reference)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>
                    Affichage de {startIndex + 1} à {Math.min(endIndex, filteredAndSortedCourseTypes.length)} 
                    sur {filteredAndSortedCourseTypes.length} résultat(s)
                  </span>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Lignes par page:</span>
                    <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                      <SelectTrigger className="h-8 w-16">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNumber = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                        if (pageNumber > totalPages) return null;
                        
                        return (
                          <Button
                            key={pageNumber}
                            variant={currentPage === pageNumber ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNumber)}
                            className="h-8 w-8"
                          >
                            {pageNumber}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Dialogs */}
      {selectedCourseType && (
        <ViewCourseTypeDialog
          courseType={selectedCourseType}
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
        />
      )}

      {selectedCourseType && (
        <UpdateCourseTypeDialog
          courseType={selectedCourseType}
          open={updateDialogOpen}
          onOpenChange={setUpdateDialogOpen}
          onCourseTypeUpdated={fetchCourseTypes}
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce type de cours ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suppression...
                </>
              ) : (
                'Supprimer'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 