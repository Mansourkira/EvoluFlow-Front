interface SocieteData {
  Sigle?: string;
  Activite?: string;
  Pays?: string;
  Raison_Sociale?: string;
  Reference?: string;
}

/**
 * Get the dynamic logo URL for a société based on its data
 * @param societeData - The société data object
 * @returns The appropriate logo URL
 */
export const getDynamicLogoUrl = (societeData: SocieteData | null | undefined): string => {
  // If societe has a custom logo (Sigle), use it
  if (societeData?.Sigle && typeof societeData.Sigle === 'string' && societeData.Sigle.length > 0) {
    return `data:image/jpeg;base64,${societeData.Sigle}`;
  }
  
  // Dynamic fallback logic - you can customize this based on your needs
  // For example, different logos based on activity, location, etc.
  if (societeData?.Activite) {
    // You could have different logos for different activities
    const activityLogos: { [key: string]: string } = {
      'Education': '/admission1.png',
      'Formation': '/admission1.png',
      'Éducation': '/admission1.png',
      'Technology': '/tech-logo.png',
      'Technologie': '/tech-logo.png',
      'Healthcare': '/health-logo.png',
      'Santé': '/health-logo.png',
      'Finance': '/finance-logo.png',
      'Banque': '/finance-logo.png',
      'Commerce': '/commerce-logo.png',
      'Industrie': '/industry-logo.png',
      'Services': '/services-logo.png',
      'Construction': '/construction-logo.png',
      'Transport': '/transport-logo.png',
      'Tourisme': '/tourism-logo.png',
      'Agriculture': '/agriculture-logo.png',
      // Add more activity-specific logos as needed
    };
    
    // Check if there's a specific logo for this activity
    const activityLogo = activityLogos[societeData.Activite];
    if (activityLogo) {
      return activityLogo;
    }
  }
  
  // You could also use different logos based on location
  if (societeData?.Pays) {
    const countryLogos: { [key: string]: string } = {
      'Tunisia': '/admission1.png',
      'Tunisie': '/admission1.png',
      'France': '/france-logo.png',
      'Morocco': '/morocco-logo.png',
      'Maroc': '/morocco-logo.png',
      'Algeria': '/algeria-logo.png',
      'Algérie': '/algeria-logo.png',
      'Libya': '/libya-logo.png',
      'Libye': '/libya-logo.png',
      // Add more country-specific logos as needed
    };
    
    const countryLogo = countryLogos[societeData.Pays];
    if (countryLogo) {
      return countryLogo;
    }
  }
  
  // Default fallback
  return '/admission1.png';
};

/**
 * Get the fallback logo URL when the primary logo fails to load
 * @param societeData - The société data object
 * @returns The fallback logo URL
 */
export const getFallbackLogoUrl = (societeData: SocieteData | null | undefined): string => {
  // For now, we use the same logic as the main logo
  // But you could implement different fallback logic if needed
  if (societeData?.Activite) {
    // Simplified fallback based on activity
    const activityFallbacks: { [key: string]: string } = {
      'Education': '/admission1.png',
      'Formation': '/admission1.png',
      'Éducation': '/admission1.png',
      'Technology': '/tech-logo.png',
      'Technologie': '/tech-logo.png',
      'Healthcare': '/health-logo.png',
      'Santé': '/health-logo.png',
      'Finance': '/finance-logo.png',
      'Banque': '/finance-logo.png',
    };
    
    const fallback = activityFallbacks[societeData.Activite];
    if (fallback) {
      return fallback;
    }
  }
  
  // Ultimate fallback
  return '/admission1.png';
};

/**
 * Get the logo alt text for a société
 * @param societeData - The société data object
 * @returns The appropriate alt text
 */
export const getLogoAltText = (societeData: SocieteData | null | undefined): string => {
  if (societeData?.Raison_Sociale) {
    return `Logo de ${societeData.Raison_Sociale}`;
  }
  return 'Logo de la société';
};

/**
 * Check if a société has a custom logo
 * @param societeData - The société data object
 * @returns True if the société has a custom logo
 */
export const hasCustomLogo = (societeData: SocieteData | null | undefined): boolean => {
  return !!(societeData?.Sigle && typeof societeData.Sigle === 'string' && societeData.Sigle.length > 0);
};

/**
 * Get the logo key for React key prop (helps with re-rendering)
 * @param societeData - The société data object
 * @returns A unique key for the logo
 */
export const getLogoKey = (societeData: SocieteData | null | undefined): string => {
  if (societeData?.Reference) {
    return `${societeData.Reference}-${hasCustomLogo(societeData) ? Date.now() : 'default'}`;
  }
  return `logo-${Date.now()}`;
}; 