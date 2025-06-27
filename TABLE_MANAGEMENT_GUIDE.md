# Guide : Implémentation de Gestion de Tables dans le Dashboard

## Vue d'ensemble de l'architecture

Ce projet utilise une architecture modulaire Next.js avec les composants suivants :

- **Frontend** : Next.js 14 avec TypeScript
- **UI Components** : shadcn/ui avec Tailwind CSS
- **State Management** : React hooks personnalisés
- **Validation** : Zod schemas
- **API** : Next.js API routes (proxy vers backend externe)

## Structure de fichiers pour une nouvelle entité (exemple : "Products")

```
app/
├── api/
│   └── products/
│       ├── add/
│       │   └── route.ts
│       ├── get/
│       │   └── route.ts
│       ├── update/
│       │   └── route.ts
│       └── delete/
│           └── route.ts
├── dashboard/
│   └── products/
│       └── page.tsx
components/
├── products/
│   ├── AddProductDialog.tsx
│   ├── UpdateProductDialog.tsx
│   └── ViewProductDialog.tsx
hooks/
└── useProducts.ts
schemas/
└── productSchema.ts
```

## Étape 1 : Créer le schéma de validation (schemas/productSchema.ts)

```typescript
import { z } from 'zod';

// Schéma pour l'ajout d'un produit
export const addProductSchema = z.object({
  Reference: z.string().optional(), // Auto-généré
  Nom: z.string().min(1, 'Le nom est requis').max(255, 'Nom trop long'),
  Description: z.string().optional(),
  Prix: z.number().min(0, 'Le prix doit être positif'),
  Categorie: z.string().min(1, 'La catégorie est requise'),
  Stock: z.number().int().min(0, 'Le stock doit être positif'),
  Active: z.boolean().default(true),
});

export type AddProductFormData = z.infer<typeof addProductSchema>;

// Schéma pour la mise à jour
export const updateProductSchema = z.object({
  Reference: z.string(),
  Nom: z.string().min(1, 'Le nom est requis').max(255, 'Nom trop long').optional(),
  Description: z.string().optional(),
  Prix: z.number().min(0, 'Le prix doit être positif').optional(),
  Categorie: z.string().optional(),
  Stock: z.number().int().min(0, 'Le stock doit être positif').optional(),
  Active: z.boolean().optional(),
});

export type UpdateProductFormData = z.infer<typeof updateProductSchema>;

// Interface pour l'affichage
export interface ViewProductData {
  Reference: string;
  Nom: string;
  Description?: string;
  Prix: number;
  Categorie: string;
  Stock: number;
  Active: boolean;
  Utilisateur?: string;
  Heure?: string;
}

export interface Product extends ViewProductData {
  id: string;
}
```

## Étape 2 : Créer le hook personnalisé (hooks/useProducts.ts)

```typescript
import { useEffect, useState } from 'react';
import { AddProductFormData, UpdateProductFormData, Product } from '@/schemas/productSchema';

interface UseProductsReturn {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  addProduct: (productData: AddProductFormData) => Promise<Product>;
  updateProduct: (reference: string, productData: UpdateProductFormData) => Promise<Product>;
  deleteProduct: (reference: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const response = await fetch('/api/products', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error instanceof Error ? error.message : 'Erreur inconnue');
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addProduct = async (productData: AddProductFormData): Promise<Product> => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/products/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...productData,
          Reference: productData.Reference || `P${Date.now()}`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Échec de création' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const newProduct = await response.json();
      await fetchProducts(); // Rafraîchir la liste
      return newProduct;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProduct = async (reference: string, productData: UpdateProductFormData): Promise<Product> => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/products/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ Reference: reference, ...productData }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Échec de mise à jour' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const updatedProduct = await response.json();
      await fetchProducts(); // Rafraîchir la liste
      return updatedProduct;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (reference: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/products/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ Reference: reference }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Échec de suppression' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      await fetchProducts(); // Rafraîchir la liste
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    isLoading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts,
  };
};
```

## Étape 3 : Créer les routes API

### app/api/products/route.ts (GET)
```typescript
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return Response.json({ error: 'Token manquant' }, { status: 401 });
    }

    const response = await fetch('http://localhost:3000/api/v1/products', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return Response.json(errorData, { status: response.status });
    }

    const result = await response.json();
    return Response.json(result);
  } catch (error) {
    console.error('Error fetching products:', error);
    return Response.json({ error: 'Échec de récupération des produits' }, { status: 500 });
  }
}
```

### app/api/products/add/route.ts
```typescript
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const token = request.cookies.get('token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return Response.json({ error: 'Token manquant' }, { status: 401 });
    }

    const response = await fetch('http://localhost:3000/api/v1/products/add', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return Response.json(errorData, { status: response.status });
    }

    const result = await response.json();
    return Response.json(result);
  } catch (error) {
    console.error('Error adding product:', error);
    return Response.json({ error: 'Échec d\'ajout du produit' }, { status: 500 });
  }
}
```

### app/api/products/update/route.ts
```typescript
import { NextRequest } from 'next/server';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    const token = request.cookies.get('token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return Response.json({ error: 'Token manquant' }, { status: 401 });
    }

    const response = await fetch('http://localhost:3000/api/v1/products/update', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return Response.json(errorData, { status: response.status });
    }

    const result = await response.json();
    return Response.json(result);
  } catch (error) {
    console.error('Error updating product:', error);
    return Response.json({ error: 'Échec de mise à jour du produit' }, { status: 500 });
  }
}
```

### app/api/products/delete/route.ts
```typescript
import { NextRequest } from 'next/server';

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    
    const token = request.cookies.get('token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return Response.json({ error: 'Token manquant' }, { status: 401 });
    }

    const response = await fetch('http://localhost:3000/api/v1/products/delete', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return Response.json(errorData, { status: response.status });
    }

    const result = await response.json();
    return Response.json(result);
  } catch (error) {
    console.error('Error deleting product:', error);
    return Response.json({ error: 'Échec de suppression du produit' }, { status: 500 });
  }
}
```

## Étape 4 : Créer la page dashboard (app/dashboard/products/page.tsx)

```typescript
"use client";

import React, { useState } from 'react';
import { GenericDataTable } from '@/components/ui/GenericDataTable';
import { useProducts } from '@/hooks/useProducts';
import { AddProductDialog } from '@/components/products/AddProductDialog';
import { ViewProductDialog } from '@/components/products/ViewProductDialog';
import { UpdateProductDialog } from '@/components/products/UpdateProductDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Eye, Edit, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Product, ViewProductData } from '@/schemas/productSchema';

export default function ProductsPage() {
  const { products, isLoading, error, refetch, deleteProduct } = useProducts();
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [productToView, setProductToView] = useState<ViewProductData | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [productToUpdate, setProductToUpdate] = useState<Product | null>(null);

  // Définir les colonnes du tableau
  const columns = [
    {
      key: 'Reference',
      label: 'Référence',
      sortable: true,
      filterable: true,
      render: (product: Product) => (
        <span className="font-mono text-sm">{product.Reference}</span>
      )
    },
    {
      key: 'Nom',
      label: 'Nom',
      sortable: true,
      filterable: true,
      render: (product: Product) => (
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-gray-500" />
          <span className="font-medium">{product.Nom}</span>
        </div>
      )
    },
    {
      key: 'Categorie',
      label: 'Catégorie',
      sortable: true,
      filterable: true,
      render: (product: Product) => (
        <Badge variant="secondary">{product.Categorie}</Badge>
      )
    },
    {
      key: 'Prix',
      label: 'Prix',
      sortable: true,
      render: (product: Product) => (
        <span className="font-medium">{product.Prix.toFixed(2)} €</span>
      )
    },
    {
      key: 'Stock',
      label: 'Stock',
      sortable: true,
      render: (product: Product) => (
        <Badge variant={product.Stock > 0 ? "default" : "destructive"}>
          {product.Stock}
        </Badge>
      )
    },
    {
      key: 'Active',
      label: 'Statut',
      sortable: true,
      filterable: true,
      render: (product: Product) => (
        <Badge variant={product.Active ? "default" : "secondary"}>
          {product.Active ? 'Actif' : 'Inactif'}
        </Badge>
      )
    }
  ];

  // Gestion des actions
  const handleView = (product: Product) => {
    setProductToView(product);
    setViewDialogOpen(true);
  };

  const handleEdit = (product: Product) => {
    setProductToUpdate(product);
    setUpdateDialogOpen(true);
  };

  const handleDelete = async (productReference: string) => {
    try {
      await deleteProduct(productReference);
      const deletedProduct = products.find(p => p.Reference === productReference);
      toast.success(`✅ Produit supprimé - ${deletedProduct?.Nom || productReference} a été supprimé avec succès`);
      refetch();
    } catch (error) {
      toast.error(`❌ Erreur de suppression - ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  const handleBulkDelete = async (productReferences: string[]) => {
    try {
      await Promise.all(productReferences.map(ref => deleteProduct(ref)));
      toast.success(`✅ ${productReferences.length} produit(s) supprimé(s) avec succès`);
      refetch();
    } catch (error) {
      toast.error(`❌ Erreur de suppression - ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  const handleExport = async (format: string, selectedOnly = false) => {
    // Logique d'export à implémenter
    toast.info(`Export ${format} ${selectedOnly ? 'des éléments sélectionnés' : 'de tous les éléments'} (à implémenter)`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Produits</h1>
          <p className="text-muted-foreground">
            Gérez vos produits et leur inventaire
          </p>
        </div>
      </div>

      <GenericDataTable
        data={products}
        isLoading={isLoading}
        error={error}
        onRefresh={refetch}
        title="Produits"
        description="Liste de tous les produits"
        entityName="produit"
        entityNamePlural="produits"
        columns={columns}
        idField="Reference"
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
        onExport={handleExport}
        enableSearch={true}
        enableAdvancedFilters={true}
        enableBulkSelect={true}
        enableColumnToggle={true}
        enableExport={true}
        enableRefresh={true}
        addButton={
          <AddProductDialog onProductAdded={refetch}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un produit
            </Button>
          </AddProductDialog>
        }
      />

      {/* Dialogs */}
      <ViewProductDialog
        product={productToView}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
      />

      <UpdateProductDialog
        product={productToUpdate}
        open={updateDialogOpen}
        onOpenChange={setUpdateDialogOpen}
        onProductUpdated={refetch}
      />
    </div>
  );
}
```

## Étape 5 : Créer les dialogs

### components/products/AddProductDialog.tsx

```typescript
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { addProductSchema, type AddProductFormData } from "@/schemas/productSchema";
import { useProducts } from "@/hooks/useProducts";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus } from "lucide-react";

interface AddProductDialogProps {
  children: React.ReactNode;
  onProductAdded?: () => void;
}

export function AddProductDialog({ children, onProductAdded }: AddProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addProduct } = useProducts();
  const { toast } = useToast();

  const form = useForm<AddProductFormData>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      Reference: "",
      Nom: "",
      Description: "",
      Prix: 0,
      Categorie: "",
      Stock: 0,
      Active: true,
    },
  });

  const onSubmit = async (data: AddProductFormData) => {
    setIsLoading(true);
    try {
      await addProduct(data);
      toast({
        title: "✅ Produit créé",
        description: `${data.Nom} a été ajouté avec succès.`,
      });
      
      form.reset();
      setOpen(false);
      onProductAdded?.();
    } catch (error) {
      console.error('Erreur création produit:', error);
      toast({
        title: "❌ Erreur de création",
        description: error instanceof Error ? error.message : "Impossible de créer le produit.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Ajouter un nouveau produit
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations du nouveau produit.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="Reference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Référence</FormLabel>
                    <FormControl>
                      <Input placeholder="Auto-généré si vide" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="Nom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom du produit" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="Description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Description du produit" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="Prix"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        placeholder="0.00" 
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="Stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="Categorie"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catégorie *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="electronique">Électronique</SelectItem>
                      <SelectItem value="vetements">Vêtements</SelectItem>
                      <SelectItem value="maison">Maison</SelectItem>
                      <SelectItem value="sport">Sport</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="Active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Produit actif</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Créer le produit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
```

## Meilleures pratiques à suivre

### 1. **Cohérence des noms**
- Utilisez des noms cohérents pour les entités (singulier/pluriel)
- Respectez la convention de nommage des fichiers

### 2. **Gestion des erreurs**
- Toujours gérer les erreurs dans les hooks
- Afficher des messages d'erreur informatifs
- Utiliser try/catch dans les fonctions async

### 3. **Validation des données**
- Utiliser Zod pour la validation côté client
- Valider également côté serveur
- Messages d'erreur en français

### 4. **Performance**
- Utiliser useMemo pour les calculs coûteux
- Optimiser les re-rendus avec useCallback
- Pagination pour les grandes listes

### 5. **Sécurité**
- Toujours vérifier l'authentification
- Valider les tokens côté serveur
- Sanitiser les données d'entrée

### 6. **UI/UX**
- Loading states pour toutes les actions
- Feedback utilisateur (toasts)
- Responsive design
- Accessibilité

## Checklist d'implémentation

- [ ] Créer le schéma Zod avec validation
- [ ] Implémenter le hook personnalisé
- [ ] Créer les routes API (GET, POST, PUT, DELETE)
- [ ] Développer la page dashboard
- [ ] Créer les dialogs (Add, Update, View)
- [ ] Tester toutes les fonctionnalités CRUD
- [ ] Gestion des erreurs et loading states
- [ ] Responsive design
- [ ] Tests unitaires (optionnel)

## Ressources utiles

- **shadcn/ui** : https://ui.shadcn.com/
- **Zod** : https://zod.dev/
- **React Hook Form** : https://react-hook-form.com/
- **Tailwind CSS** : https://tailwindcss.com/

Ce guide couvre tous les aspects nécessaires pour implémenter une gestion de table complète dans le dashboard. Suivez les étapes dans l'ordre et adaptez les exemples à votre entité spécifique.