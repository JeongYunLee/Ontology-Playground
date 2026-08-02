import { useMemo } from 'react';
import type { AppLocale } from '../../i18n';
import type { EntityType, Relationship, Ontology } from '../../data/ontology';
import { useAppStore } from '../../store/appStore';

/** Pick the locale-appropriate display name for an entity, with English fallback. */
export function entityLabel(entity: EntityType, locale: AppLocale): string {
  if (locale === 'ko' && entity.nameKo) return entity.nameKo;
  return entity.name;
}

/** Pick the locale-appropriate description, with English fallback. */
export function entityDescription(entity: EntityType, locale: AppLocale): string {
  if (locale === 'ko' && entity.descriptionKo) return entity.descriptionKo;
  return entity.description;
}

export function relationshipLabel(rel: Relationship, locale: AppLocale): string {
  if (locale === 'ko' && rel.nameKo) return rel.nameKo;
  return rel.name;
}

export function relationshipDescription(rel: Relationship, locale: AppLocale): string | undefined {
  if (locale === 'ko' && rel.descriptionKo) return rel.descriptionKo;
  return rel.description;
}

export function ontologyLabel(ontology: Ontology, locale: AppLocale): string {
  if (locale === 'ko' && ontology.nameKo) return ontology.nameKo;
  return ontology.name;
}

export function ontologyDescription(ontology: Ontology, locale: AppLocale): string {
  if (locale === 'ko' && ontology.descriptionKo) return ontology.descriptionKo;
  return ontology.description;
}

/**
 * Return a version of the ontology whose entity/relationship `.name` and
 * `.description` fields are replaced with locale-appropriate variants where
 * available. Callers can then read `.name`/`.description` uniformly.
 *
 * IDs, icons, colors, and properties are left untouched.
 */
export function applyLocaleToOntology(ontology: Ontology, locale: AppLocale): Ontology {
  if (locale !== 'ko') return ontology;
  const anyKo =
    ontology.nameKo ||
    ontology.descriptionKo ||
    ontology.entityTypes.some((e) => e.nameKo || e.descriptionKo) ||
    ontology.relationships.some((r) => r.nameKo || r.descriptionKo);
  if (!anyKo) return ontology;

  return {
    ...ontology,
    name: ontology.nameKo ?? ontology.name,
    description: ontology.descriptionKo ?? ontology.description,
    entityTypes: ontology.entityTypes.map((e) =>
      e.nameKo || e.descriptionKo
        ? { ...e, name: e.nameKo ?? e.name, description: e.descriptionKo ?? e.description }
        : e,
    ),
    relationships: ontology.relationships.map((r) =>
      r.nameKo || r.descriptionKo
        ? { ...r, name: r.nameKo ?? r.name, description: r.descriptionKo ?? r.description }
        : r,
    ),
  };
}

/**
 * Read the current ontology with locale substitutions applied for display.
 * Use this in display components; use the raw `currentOntology` from the
 * store when editing (Designer) so authors stay in the English source.
 */
export function useLocalizedOntology(): Ontology {
  const ontology = useAppStore((s) => s.currentOntology);
  const locale = useAppStore((s) => s.locale);
  return useMemo(() => applyLocaleToOntology(ontology, locale), [ontology, locale]);
}
