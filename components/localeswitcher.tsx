'use client'; // Indique que c'est un composant client

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { ChangeEvent, useTransition } from 'react';

// Assurez-vous d'importer vos locales depuis votre configuration i18n.ts
// L'alias '@/' suppose que votre tsconfig.json est configuré pour pointer vers la racine du projet ou 'src'.
import { locales } from '@/app/i18n'; // Assurez-vous que le chemin est correct

export default function LocaleSwitcher() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const t = useTranslations('LocaleSwitcher'); // 'LocaleSwitcher' est une clé dans vos fichiers de messages

  function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value;
    startTransition(() => {
      // Remplacez la locale actuelle dans le chemin d'URL
      // Par exemple, de '/fr/about' à '/en/about'
      router.replace(`/${nextLocale}${pathname.substring(3)}`); // substring(3) retire '/xx' du début du chemin
    });
  }

  return (
    <label className="relative text-gray-700">
      <p className="sr-only">{t('label')}</p> {/* Label pour l'accessibilité */}
      <select
        className="block w-full pl-3 pr-8 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        defaultValue={currentLocale}
        disabled={isPending}
        onChange={onSelectChange}
      >
        {locales.map((cur) => (
          <option key={cur} value={cur}>
            {t('locale', { locale: cur })} {/* Utilise les traductions pour les noms des langues */}
          </option>
        ))}
      </select>
      {/* Optionnel : Indicateur de chargement */}
      {isPending && <span className="ml-2 text-sm text-gray-500">Chargement...</span>}
    </label>
  );
}