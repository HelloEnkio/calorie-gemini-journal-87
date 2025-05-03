interface FuzzySearchOptions {
  threshold?: number;
  caseSensitive?: boolean;
  sort?: boolean;
  maxResults?: number;
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
      threshold: options.threshold || 0.2, // Réduire le seuil pour avoir plus de résultats
      caseSensitive: options.caseSensitive || false,
      sort: options.sort !== undefined ? options.sort : true,
      maxResults: options.maxResults || 5,
    };
  }

  /**
   * Effectue une recherche dans les items
   * @param query Terme de recherche
   * @returns Tableau d'items correspondants
   */
  search(query: string): any[] {
    if (!query || query === '') {
      // Retourner les premiers éléments si aucune requête
      return this.items.slice(0, this.options.maxResults);
    }

    const preparedQuery = this.options.caseSensitive ? query : query.toLowerCase();
    
    // Calculer le score de pertinence pour chaque item
    const scoredResults = this.items.map((item) => {
      const maxScore = this.keys.reduce((highest, key) => {
        const value = this.getPropertyValue(item, key);
        const preparedValue = this.options.caseSensitive 
          ? String(value) 
          : String(value).toLowerCase();

        // Calcule la similarité entre la requête et la valeur
        const similarity = this.calculateSimilarity(preparedQuery, preparedValue);
        
        return Math.max(highest, similarity);
      }, 0);

      return { item, score: maxScore };
    });

    // Trier les résultats par score de pertinence
    const sortedResults = scoredResults.sort((a, b) => b.score - a.score);
    
    // Si on veut uniquement les résultats au-dessus du seuil
    if (this.options.threshold !== undefined) {
      const filteredResults = sortedResults.filter(result => result.score >= this.options.threshold!);
      
      // Retourner au maximum le nombre défini dans maxResults
      return filteredResults.slice(0, this.options.maxResults).map(result => result.item);
    }
    
    // Sinon retourner simplement les N premiers résultats
    return sortedResults.slice(0, this.options.maxResults).map(result => result.item);
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
