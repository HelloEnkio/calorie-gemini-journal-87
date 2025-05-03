
interface FuzzySearchOptions {
  threshold?: number;
  caseSensitive?: boolean;
  sort?: boolean;
}

/**
 * Classe pour effectuer des recherches floues dans un tableau d'objets
 */
export class FuzzySearch {
  private items: any[];
  private keys: string[];
  private options: FuzzySearchOptions;

  /**
   * @param items Tableau d'objets à rechercher
   * @param keys Propriétés des objets à utiliser pour la recherche
   * @param options Options de recherche
   */
  constructor(
    items: any[],
    keys: string[] = [],
    options: FuzzySearchOptions = {},
  ) {
    this.items = items;
    this.keys = keys;
    this.options = {
      threshold: options.threshold || 0.5,
      caseSensitive: options.caseSensitive || false,
      sort: options.sort !== undefined ? options.sort : true,
    };
  }

  /**
   * Effectue une recherche dans les items
   * @param query Terme de recherche
   * @returns Tableau d'items correspondants
   */
  search(query: string): any[] {
    if (!query || query === '') {
      return [];
    }

    const preparedQuery = this.options.caseSensitive ? query : query.toLowerCase();
    const results = this.items.filter((item) => {
      return this.keys.some((key) => {
        const value = this.getPropertyValue(item, key);
        const preparedValue = this.options.caseSensitive 
          ? String(value) 
          : String(value).toLowerCase();

        // Calcule la similarité entre la requête et la valeur
        const similarity = this.calculateSimilarity(preparedQuery, preparedValue);
        
        return similarity >= this.options.threshold!;
      });
    });

    // Trier les résultats par pertinence si nécessaire
    if (this.options.sort) {
      return this.sortResultsByRelevance(results, preparedQuery);
    }

    return results;
  }

  /**
   * Récupère la valeur d'une propriété d'un objet, même si c'est une propriété imbriquée
   */
  private getPropertyValue(item: any, key: string): any {
    const keys = key.split('.');
    let value = item;
    
    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k];
      } else {
        return '';
      }
    }
    
    return value;
  }

  /**
   * Calcule la similarité entre deux chaînes
   * Utilise une version simplifiée de l'algorithme de similarité
   */
  private calculateSimilarity(query: string, value: string): number {
    if (value.includes(query)) {
      // Si la valeur contient exactement la requête, haute similarité
      return 1;
    }
    
    const queryLength = query.length;
    const valueLength = value.length;
    
    // Si la requête est plus longue que la valeur, peu de chance de correspondance
    if (queryLength > valueLength) {
      return 0;
    }
    
    // Version simplifiée de la distance de Levenshtein
    let matches = 0;
    
    // On vérifie chaque position où pourrait commencer une correspondance
    for (let i = 0; i <= valueLength - queryLength; i++) {
      const substring = value.substring(i, i + queryLength);
      let localMatches = 0;
      
      // Compter les caractères correspondants
      for (let j = 0; j < queryLength; j++) {
        if (substring[j] === query[j]) {
          localMatches++;
        }
      }
      
      // Garder le meilleur score de correspondance
      matches = Math.max(matches, localMatches);
    }
    
    // Calculer la similarité comme ratio de caractères correspondants
    return matches / queryLength;
  }

  /**
   * Trie les résultats par pertinence
   */
  private sortResultsByRelevance(results: any[], query: string): any[] {
    return results.sort((a, b) => {
      const scoreA = this.calculateRelevanceScore(a, query);
      const scoreB = this.calculateRelevanceScore(b, query);
      return scoreB - scoreA;
    });
  }

  /**
   * Calcule un score de pertinence pour un item
   */
  private calculateRelevanceScore(item: any, query: string): number {
    return this.keys.reduce((maxScore, key) => {
      const value = this.getPropertyValue(item, key);
      const preparedValue = this.options.caseSensitive
        ? String(value)
        : String(value).toLowerCase();
      
      const similarity = this.calculateSimilarity(query, preparedValue);
      return Math.max(maxScore, similarity);
    }, 0);
  }
}
