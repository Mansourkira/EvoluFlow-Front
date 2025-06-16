"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUsers } from "@/hooks/useUsers";
import { addUserSchema, type AddUserFormData } from "@/schemas/userSchema";
import { Loader2, Plus, Upload, X } from "lucide-react";

interface AddUserDialogProps {
  onUserAdded?: () => void;
}

export function AddUserDialog({ onUserAdded }: AddUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { addUser, isLoading, error } = useUsers();

  const form = useForm<AddUserFormData>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      reference: "",
      nom: "",
      prenom: "",
      adresse: "",
      complement_adresse: "",
      code_postal: "",
      ville: "",
      gouvernorat: "",
      pays: "",
      telephone: "",
      type_utilisateur: "",
      e_mail: "",
      mot_de_passe: "",
      site_defaut: "",
      profil: "",
      image: null,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      form.setValue("image", file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    form.setValue("image", null);
  };

  const onSubmit = async (data: AddUserFormData) => {
    try {
      await addUser(data);
      alert("User created successfully!");
      
      // Reset form and close dialog
      form.reset();
      setSelectedImage(null);
      setImagePreview(null);
      setOpen(false);
      
      // Notify parent component
      onUserAdded?.();
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : "Failed to create user"}`);
    }
  };

  const handleCancel = () => {
    form.reset();
    setSelectedImage(null);
    setImagePreview(null);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <Plus className="-ms-1 me-2 opacity-60" size={16} strokeWidth={2} aria-hidden="true" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Fill in the information below to create a new user account.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Reference */}
              <FormField
                control={form.control}
                name="reference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reference *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter reference" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="e_mail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* First Name */}
              <FormField
                control={form.control}
                name="prenom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Last Name */}
              <FormField
                control={form.control}
                name="nom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="telephone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="mot_de_passe"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password *</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Address Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Address Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Address */}
                <FormField
                  control={form.control}
                  name="adresse"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Address *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Address Complement */}
                <FormField
                  control={form.control}
                  name="complement_adresse"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Address Complement</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter address complement (optional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Postal Code */}
                <FormField
                  control={form.control}
                  name="code_postal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter postal code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* City */}
                <FormField
                  control={form.control}
                  name="ville"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter city" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Governorate */}
                <FormField
                  control={form.control}
                  name="gouvernorat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Governorate *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter governorate" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Country */}
                <FormField
                  control={form.control}
                  name="pays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* System Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">System Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* User Type */}
                <FormField
                  control={form.control}
                  name="type_utilisateur"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select user type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">Administrator</SelectItem>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="guest">Guest</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Default Site */}
                <FormField
                  control={form.control}
                  name="site_defaut"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Site *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter default site" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Profile */}
                <FormField
                  control={form.control}
                  name="profil"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select profile" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">Profile 1</SelectItem>
                          <SelectItem value="2">Profile 2</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Profile Image</h3>
              <div className="flex items-center gap-4">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                    <Upload size={20} className="text-gray-400" />
                  </div>
                )}
                <div>
                  <Label htmlFor="image-upload" className="cursor-pointer">
                    <Button type="button" variant="outline" asChild>
                      <span>Choose Image</span>
                    </Button>
                  </Label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Upload a profile image (optional)
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create User
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 