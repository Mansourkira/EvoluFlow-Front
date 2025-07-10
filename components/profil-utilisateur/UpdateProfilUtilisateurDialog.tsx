"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  updateProfilUtilisateurSchema,
  ProfilUtilisateur,
} from "@/schemas/profilUtilisateurSchema";

interface UpdateProfilUtilisateurDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profil: ProfilUtilisateur;
  onSubmit: (data: ProfilUtilisateur) => void;
}

export default function UpdateProfilUtilisateurDialog({
  open,
  onOpenChange,
  profil,
  onSubmit,
}: UpdateProfilUtilisateurDialogProps) {
  const form = useForm<ProfilUtilisateur>({
    resolver: zodResolver(updateProfilUtilisateurSchema),
    defaultValues: profil,
  });
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = form;

  useEffect(() => {
    reset(profil);
  }, [profil, reset]);

  const onSubmitForm = (data: ProfilUtilisateur) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier Profil Utilisateur</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
            {/* Référence (désactivée) */}
            <FormField
              control={control}
              name="Reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Référence</FormLabel>
                  <FormControl>
                    <Input disabled {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Libellé */}
            <FormField
              control={control}
              name="Libelle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Libellé</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Couleur du badge */}
            <FormField
              control={control}
              name="Couleur_Badge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Couleur du badge</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex justify-end">
              <Button type="submit">Mettre à jour</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
