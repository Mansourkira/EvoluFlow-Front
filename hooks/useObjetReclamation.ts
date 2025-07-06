import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ObjetReclamationFormValues } from "@/schemas/objetReclamationSchema";
import { useRouter } from 'next/navigation';

interface ObjetReclamation {
    Reference: string;
    Libelle: string;
    Utilisateur: string;
    Heure: string;
}

export function useObjetReclamation() {
    const [objetReclamations, setObjetReclamations] = useState<ObjetReclamation[]>([]);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        fetchObjetReclamations();
    }, []);

    const fetchObjetReclamations = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            // Check if token exists
            if (!token) {
                router.push('/login');
                return;
            }

            console.log('Fetching data with token:', token); // Debug log

            const response = await fetch(`http://localhost:3000/api/v1/object-de-reclamation`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }   
            });

            console.log('Response status:', response.status); // Debug log

            if (response.status === 403 || response.status === 401) {
                console.log('Auth error - redirecting to login'); // Debug log
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                router.push('/login');
                return;
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('API Error:', {
                    status: response.status,
                    statusText: response.statusText,
                    error: errorData
                });
                throw new Error(errorData.message || 'Failed to fetch objets de reclamation');
            }

            const data = await response.json();
            console.log('API Response:', data); // Debug log

            if (!Array.isArray(data)) {
                console.error('Invalid data format:', data);
                setObjetReclamations([]);
                return;
            }

            // Map the data to match our interface
            const formattedData = data.map(item => ({
                Reference: item.Reference || '',
                Libelle: item.Libelle || '',
                Utilisateur: item.Utilisateur || '',
                Heure: item.Heure || ''
            }));

            console.log('Formatted data:', formattedData); // Debug log
            setObjetReclamations(formattedData);
        } catch (error) {
            console.error('Error fetching:', error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to fetch objets de reclamation",
                variant: "destructive",
            });
            setObjetReclamations([]);
        } finally {
            setLoading(false);
        }
    };

    const createObjetReclamation = async (data: ObjetReclamationFormValues) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/v1/object-de-reclamation/add`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to create objet de reclamation');
            }
            await fetchObjetReclamations(); // Refresh the list after creation
            toast({
                title: "Success",
                description: "Objet de reclamation created successfully",
            });
            return true;
        } catch (error) {
            console.error('Error creating:', error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to create objet de reclamation",
                variant: "destructive",
            });
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateObjetReclamation = async (reference: string, data: ObjetReclamationFormValues) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/v1/object-de-reclamation/${reference}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to update objet de reclamation');
            }
            await fetchObjetReclamations(); // Refresh the list after update
            toast({
                title: "Success",
                description: "Objet de reclamation updated successfully",
            });
            return true;
        } catch (error) {
            console.error('Error updating:', error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to update objet de reclamation",
                variant: "destructive",
            });
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteObjetReclamation = async (reference: string) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/v1/object-de-reclamation/${reference}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to delete objet de reclamation');
            }
            await fetchObjetReclamations(); // Refresh the list after deletion
            toast({
                title: "Success",
                description: "Objet de reclamation deleted successfully",
            });
            return true;
        } catch (error) {
            console.error('Error deleting:', error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to delete objet de reclamation",
                variant: "destructive",
            });
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        objetReclamations,
        loading,
        fetchObjetReclamations,
        createObjetReclamation,
        updateObjetReclamation,
        deleteObjetReclamation,
    };
} 