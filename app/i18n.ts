// app/i18n.ts
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Définissez vos locales supportées
export const locales = ['en', 'fr'];
 // Ajoutez 'ar' si c'est une de vos langues

export default getRequestConfig(async ({ locale }) => {
  // Validez que la locale entrante est une de vos locales configurées.
  // Si la locale n'est pas trouvée, cela affichera une page 404.
  if (!locales.includes(locale as any)) notFound();

  return {
    // Chargez le fichier de messages correspondant à la locale.
    // Assurez-vous que le chemin vers votre dossier `messages` est correct
    // par rapport à ce fichier `i18n.ts`.
    messages: (await import(`../messages/${locale}.json`)).default
  };
});