// src/components/urgenceTache/AddUrgenceTacheDialog.tsx
"use client";

import { useEffect } from "react";
import { Shuffle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUrgenceTaches } from "@/hooks/useUrgenceTaches";
import { addUrgenceTacheSchema,UrgenceTache } from "@/schemas/urgenceTacheSchema";



interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UrgenceTache) => void;
}

export default function AddUrgenceTacheDialog({ open, onClose, onSubmit }: Props) {
  const { toast } = useToast();
  const { urgences } = useUrgenceTaches();

  const { register, handleSubmit, reset, setValue, getValues } = useForm<UrgenceTache>({
    resolver: zodResolver(addUrgenceTacheSchema)
  });

  const generateReference = () => {
    const yy = new Date().getFullYear().toString().slice(-2);
    const mm = (new Date().getMonth()+1).toString().padStart(2,'0');
    const prefix = `UT${yy}${mm}`;
    const existing = urgences.map(u=>u.Reference).filter(r=>r.startsWith(prefix));
    let ref;
    do {
      ref = `${prefix}${Math.floor(1000+Math.random()*9000)}`;
    } while(existing.includes(ref));
    setValue('Reference', ref);
    toast({ title:'Réf générée', description:ref });
  };

  useEffect(()=>{
    if(open){
      reset();
      generateReference();
    }
  },[open, reset]);

  const submit = (data: UrgenceTache) => {
    onSubmit(data);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter Urgence de Tâche</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div>
            <label htmlFor="Reference" className="block mb-1">Référence</label>
            <div className="flex gap-2 items-center">
              <Input
                id="Reference"
                {...register("Reference")}
                disabled
              />
              <Button type="button" size="icon" variant="outline" onClick={generateReference}>
                <Shuffle className="h-4 w-4"/>
              </Button>
            </div>
          </div>
          <div>
            <label htmlFor="Libelle" className="block mb-1">Libellé</label>
            <Input id="Libelle" {...register("Libelle")} />
          </div>
          <div className="flex justify-end">
            <Button type="submit">Ajouter</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
