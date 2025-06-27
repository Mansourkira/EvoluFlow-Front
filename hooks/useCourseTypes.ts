import { useState, useCallback } from 'react';
import { CourseType } from '@/schemas/courseTypeSchema';

export const useCourseTypes = () => {
  const [courseTypes, setCourseTypes] = useState<CourseType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all course types
  const fetchCourseTypes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/type_cour', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCourseTypes(data);
      } else {
        throw new Error('Erreur lors de la récupération des types de cours');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Add course type
  const addCourseType = useCallback(async (courseTypeData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/type_cour/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseTypeData),
      });

      if (response.ok) {
        await fetchCourseTypes(); // Refresh list
        return true;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'ajout');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchCourseTypes]);

  // Update course type
  const updateCourseType = useCallback(async (courseTypeData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/type_cour/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseTypeData),
      });

      if (response.ok) {
        await fetchCourseTypes(); // Refresh list
        return true;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la modification');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchCourseTypes]);

  // Delete course type
  const deleteCourseType = useCallback(async (reference: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/type_cour/delete', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Reference: reference }),
      });

      if (response.ok) {
        await fetchCourseTypes(); // Refresh list
        return true;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la suppression');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchCourseTypes]);

  // Get course type by reference
  const getCourseTypeByReference = useCallback(async (reference: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/type_cour/reference', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Reference: reference }),
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error('Type de cours non trouvé');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    courseTypes,
    isLoading,
    error,
    fetchCourseTypes,
    addCourseType,
    updateCourseType,
    deleteCourseType,
    getCourseTypeByReference,
    refetch: fetchCourseTypes,
  };
}; 