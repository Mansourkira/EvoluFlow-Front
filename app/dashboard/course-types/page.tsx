"use client";

import { useEffect, useState } from "react";
import { useCourseTypes } from "@/hooks/useCourseTypes";
import { CourseType, getPriorityLabel, getPriorityColor, getPriorityIcon, getPriorityBadgeVariant } from "@/schemas/courseTypeSchema";
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
import { exportGenericData, createCourseTypeExportConfig } from "@/lib/exportUtils";
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
  ArrowDown,
  ArrowUp,
  Minus,
  AlertTriangle,
  HelpCircle,
  Download,
  FileText,
} from "lucide-react";

type SortField = 'Reference' | 'Libelle' | 'Priorite' ;
type SortDirection = 'asc' | 'desc' | null;

interface FieldFilters {
  Reference: string;
  Libelle: string;
  Priorite: string;
}

interface ColumnVisibility {
  Reference: boolean;
  Libelle: boolean;
  Priorite: boolean;
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
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    Reference: true,
    Libelle: true,
    Priorite: true,
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
        (courseType.Priorite && courseType.Priorite.toString().includes(searchTerm.toLowerCase()));

      const matchesFilters = 
        (!fieldFilters.Reference || courseType.Reference.toLowerCase().includes(fieldFilters.Reference.toLowerCase())) &&
        (!fieldFilters.Libelle || courseType.Libelle.toLowerCase().includes(fieldFilters.Libelle.toLowerCase())) &&
        (!fieldFilters.Priorite || (courseType.Priorite && courseType.Priorite.toString() === fieldFilters.Priorite)) &&
                    (!fieldFilters.Priorite || (courseType.Priorite && courseType.Priorite.toString().includes(fieldFilters.Priorite.toLowerCase())));

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
    });
    setCurrentPage(1);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (fieldFilters.Reference) count++;
    if (fieldFilters.Libelle) count++;
    if (fieldFilters.Priorite) count++;
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

  // Export handler
  const handleExport = async (format: 'PDF' | 'Excel' | 'Word') => {
    try {
      const config = createCourseTypeExportConfig(courseTypes)
      await exportGenericData(config, format)
      toast({
        title: "Export réussi", 
        description: `${courseTypes.length} type(s) de cours exporté(s) en ${format}`,
      })
    } catch (error) {
      console.error('Erreur export:', error)
      toast({
        title: "Erreur d'export",
        description: error instanceof Error ? error.message : 'Erreur inconnue',
        variant: "destructive"
      })
    }
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
                    placeholder="Rechercher par référence, libellé ou priorité..."
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

              {/* Export */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Exporter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleExport('PDF')}>
                    <FileText className="mr-2 h-4 w-4" />
                    Exporter en PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('Excel')}>
                    <FileText className="mr-2 h-4 w-4" />
                    Exporter en Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('Word')}>
                    <FileText className="mr-2 h-4 w-4" />
                    Exporter en Word
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

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
                            <div className="flex items-center">
                              {courseType.Priorite ? (
                                <Badge 
                                  variant={getPriorityBadgeVariant(courseType.Priorite)}
                                  className={`${getPriorityColor(courseType.Priorite)} flex items-center gap-1.5 px-2.5 py-1 border font-medium`}
                                >
                                  {getPriorityIcon(courseType.Priorite) === "ArrowDown" && <ArrowDown className="h-3 w-3" />}
                                  {getPriorityIcon(courseType.Priorite) === "Minus" && <Minus className="h-3 w-3" />}
                                  {getPriorityIcon(courseType.Priorite) === "ArrowUp" && <ArrowUp className="h-3 w-3" />}
                                  {getPriorityIcon(courseType.Priorite) === "AlertTriangle" && <AlertTriangle className="h-3 w-3" />}
                                  <span className="text-xs font-semibold">
                                    {getPriorityLabel(courseType.Priorite)}
                                  </span>
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200 flex items-center gap-1.5 px-2.5 py-1">
                                  <HelpCircle className="h-3 w-3" />
                                  <span className="text-xs">Non définie</span>
                                </Badge>
                              )}
                            </div>
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