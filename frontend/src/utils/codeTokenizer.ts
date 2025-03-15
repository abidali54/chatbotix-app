interface Token {
  type: TokenType;
  value: string;
  line: number;
  metadata?: {
    scope?: string;
    importance?: 'high' | 'medium' | 'low';
    semanticType?: 'declaration' | 'definition' | 'reference' | 'control' | 'import' | 'generic' | 'async';
    foldable?: boolean;
    depth?: number;
    complexity?: number;
  };
}

type TokenType = 'keyword' | 'string' | 'comment' | 'function' | 'variable' | 'annotation' | 
                'operator' | 'number' | 'regex' | 'decorator' | 'other';

const languagePatterns: Record<string, Record<string, RegExp>> = {
  typescript: {
    keyword: /\b(function|class|interface|type|enum|const|let|var|return|if|else|for|while|import|export|extends|implements)\b/,
    string: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/,
    comment: /\/\/.*|\/\*[\s\S]*?\*\//,
    function: /\b\w+(?=\s*[\(<])/,
    variable: /\b[A-Z]\w*\b/,
    annotation: /@\w+/
  },
  python: {
    keyword: /\b(def|class|if|else|for|while|import|from|return|async|await|with|try|except|raise)\b/,
    string: /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|'''[\s\S]*?'''|"""[\s\S]*?"""/,
    comment: /#.*|'''[\s\S]*?'''|"""[\s\S]*?"""/,
    function: /\b\w+(?=\s*[\(<])/,
    variable: /\b[A-Z]\w*\b/,
    annotation: /@\w+/
  },
  java: {
    keyword: /\b(public|private|protected|class|interface|enum|extends|implements|return|if|else|for|while|try|catch|throw)\b/,
    string: /"(?:[^"\\]|\\.)*"/,
    comment: /\/\/.*|\/\*[\s\S]*?\*\//,
    function: /\b\w+(?=\s*[\(<])/,
    variable: /\b[A-Z]\w*\b/,
    annotation: /@\w+/
  },
  rust: {
    keyword: /\b(fn|struct|enum|impl|trait|pub|let|mut|return|if|else|for|while|match|use)\b/,
    string: /"(?:[^"\\]|\\.)*"/,
    comment: /\/\/.*|\/\*[\s\S]*?\*\//,
    function: /\b\w+(?=\s*[\(<])/,
    variable: /\b[A-Z]\w*\b/,
    annotation: /#\[.*?\]/
  },
  go: {
    keyword: /\b(func|type|struct|interface|package|import|return|if|else|for|range|go|chan|defer|select)\b/,
    string: /`[^`]*`|"(?:[^"\\]|\\.)*"/,
    comment: /\/\/.*|\/\*[\s\S]*?\*\//,
    function: /\b\w+(?=\s*[\(<])/,
    variable: /\b[A-Z]\w*\b/,
    annotation: /\/\/@\w+/
  }
};

// Add advanced language patterns
const advancedPatterns = {
  typescript: {
    generic: /<[^<>]+>/,
    async: /\b(async|await|Promise)\b/,
    operator: /[+\-*/%=&|^<>!]+/,
    number: /\b\d+(\.\d+)?\b/,
    decorator: /@[\w\.]+([\s\n]*\([^)]*\))?/
  }
};

// Add new utility functions
export interface CodeMetrics {
  cyclomaticComplexity: number;
  maxNestingDepth: number;
  numberOfFunctions: number;
  numberOfClasses: number;
  linesOfCode: number;
}

export function calculateMetrics(tokens: Token[]): CodeMetrics {
  let complexity = 0;
  let currentDepth = 0;
  let maxDepth = 0;
  let functions = 0;
  let classes = 0;

  tokens.forEach(token => {
    if (token.type === 'keyword') {
      if (token.value.match(/^(if|while|for|catch|case)/)) {
        complexity++;
        currentDepth++;
        maxDepth = Math.max(maxDepth, currentDepth);
      } else if (token.value === 'function') {
        functions++;
      } else if (token.value === 'class') {
        classes++;
      }
    }
  });

  return {
    cyclomaticComplexity: complexity + 1,
    maxNestingDepth: maxDepth,
    numberOfFunctions: functions,
    numberOfClasses: classes,
    linesOfCode: tokens[tokens.length - 1]?.line || 0
  };
}

// Update tokenize function
export function tokenize(code: string, language: string): Token[] {
  const patterns = { ...languagePatterns[language], ...advancedPatterns };
  const tokens: Token[] = [];
  const scopeStack: { type: string; name: string; depth: number }[] = [];
  
  const lines = code.split('\n');
  let scope = '';

  lines.forEach((line, lineNum) => {
    let pos = 0;
    while (pos < line.length) {
      let matched = false;
      for (const [type, pattern] of Object.entries(patterns)) {
        const match = line.slice(pos).match(pattern);
        if (match && match.index === 0) {
          const token: Token = {
            type: type as Token['type'],
            value: match[0],
            line: lineNum + 1,
            metadata: {
              scope
            }
          };

          // Track scope for nested structures
          if (type === 'keyword' && ['class', 'function', 'interface', 'struct'].some(k => match[0].includes(k))) {
            scope = match[0];
          }

          // Add importance for certain tokens
          if (type === 'function' || type === 'class') {
            token.metadata.importance = 'high';
          } else if (type === 'annotation') {
            token.metadata.importance = 'medium';
          }

          tokens.push(token);
          pos += match[0].length;
          matched = true;
          break;
        }
      }
      if (!matched) {
        pos++;
      }
    }
  });

  // Add advanced token processing
  tokens.forEach(token => {
    if (token.type === 'keyword') {
      if (token.value === 'async') {
        token.metadata.semanticType = 'async';
      } else if (patterns.generic.test(token.value)) {
        token.metadata.semanticType = 'generic';
      }
    }
  });

  return tokens;
}

// Add symbol resolution
export class SymbolResolver {
  private symbols: Map<string, Token> = new Map();
  private scopes: Map<string, Set<string>> = new Map();

  addSymbol(token: Token, scope: string) {
    const scopeSymbols = this.scopes.get(scope) || new Set();
    scopeSymbols.add(token.value);
    this.scopes.set(scope, scopeSymbols);
    this.symbols.set(`${scope}:${token.value}`, token);
  }

  resolveSymbol(name: string, currentScope: string): Token | undefined {
    while (currentScope) {
      const symbol = this.symbols.get(`${currentScope}:${name}`);
      if (symbol) return symbol;
      currentScope = currentScope.split('.').slice(0, -1).join('.');
    }
    return undefined;
  }
}

export function getTokenSummary(tokens: Token[]): string {
  const summary = tokens
    .filter(t => t.metadata?.importance === 'high')
    .map(t => `${t.type}: ${t.value} (line ${t.line})`)
    .join('\n');
  return summary;
}

export function analyzeFoldingRegions(tokens: Token[]): { start: number; end: number; type: string }[] {
  const regions = [];
  const stack: { token: Token; type: string }[] = [];

  for (const token of tokens) {
    if (token.metadata?.foldable) {
      if (token.value.match(/^(class|function|interface|struct|enum|if|for|while)/)) {
        stack.push({ token, type: token.value });
      } else if (token.value.match(/^(end|})$/)) {
        const start = stack.pop();
        if (start) {
          regions.push({
            start: start.token.line,
            end: token.line,
            type: start.type
          });
        }
      }
    }
  }

  return regions;
}

export function semanticAnalysis(tokens: Token[]): Token[] {
  const scopeStack: string[] = [];
  const symbolTable = new Map<string, Token>();

  return tokens.map(token => {
    // Track scope depth
    if (token.type === 'keyword') {
      if (token.value.match(/^(class|function|interface|struct|enum)/)) {
        scopeStack.push(token.value);
        token.metadata = {
          ...token.metadata,
          depth: scopeStack.length,
          foldable: true,
          semanticType: 'declaration'
        };
      }
    }

    // Analyze variable usage
    if (token.type === 'variable') {
      const existingSymbol = symbolTable.get(token.value);
      token.metadata = {
        ...token.metadata,
        semanticType: existingSymbol ? 'reference' : 'definition',
        depth: scopeStack.length
      };
      symbolTable.set(token.value, token);
    }

    return token;
  });
}

// Add advanced metrics interface
export interface AdvancedMetrics extends CodeMetrics {
  maintainabilityIndex: number;
  halsteadMetrics: {
    vocabulary: number;
    length: number;
    difficulty: number;
    effort: number;
  };
  dependencyMetrics: {
    fanIn: number;
    fanOut: number;
    instability: number;
  };
}

// Add type inference interface
interface TypeInfo {
  type: string;
  generics?: string[];
  nullable?: boolean;
  inferred: boolean;
}

// Add new utility functions
export function calculateAdvancedMetrics(tokens: Token[]): AdvancedMetrics {
  const baseMetrics = calculateMetrics(tokens);
  const halstead = calculateHalsteadMetrics(tokens);
  
  // Calculate Maintainability Index (MI)
  const mi = 171 - 
    (5.2 * Math.log(baseMetrics.cyclomaticComplexity)) -
    (0.23 * Math.log(baseMetrics.linesOfCode)) -
    (16.2 * Math.log(halstead.vocabulary));

  return {
    ...baseMetrics,
    maintainabilityIndex: Math.max(0, Math.min(100, mi)),
    halsteadMetrics: halstead,
    dependencyMetrics: analyzeDependencies(tokens)
  };
}

export class TypeInference {
  private typeMap = new Map<string, TypeInfo>();
  private dependencies = new Map<string, Set<string>>();

  inferTypes(tokens: Token[]): Map<string, TypeInfo> {
    let currentType: TypeInfo | undefined;

    tokens.forEach((token, index) => {
      if (token.type === 'variable') {
        const typeInfo = this.inferTypeFromContext(tokens, index);
        if (typeInfo) {
          this.typeMap.set(token.value, typeInfo);
        }
      }
    });

    return this.typeMap;
  }

  private inferTypeFromContext(tokens: Token[], index: number): TypeInfo | undefined {
    const token = tokens[index];
    const nextToken = tokens[index + 1];
    const prevToken = tokens[index - 1];

    if (prevToken?.value === 'const' || prevToken?.value === 'let') {
      if (nextToken?.value === '=') {
        return this.inferTypeFromValue(tokens[index + 2]);
      }
    }

    return {
      type: 'any',
      inferred: true
    };
  }

  private inferTypeFromValue(token?: Token): TypeInfo {
    if (!token) return { type: 'any', inferred: true };

    switch (token.type) {
      case 'string':
        return { type: 'string', inferred: true };
      case 'number':
        return { type: 'number', inferred: true };
      default:
        return { type: 'any', inferred: true };
    }
  }
}

export class DependencyAnalyzer {
  private modules = new Map<string, Set<string>>();

  analyzeDependencies(tokens: Token[]): void {
    let currentModule = '';
    let imports: string[] = [];

    tokens.forEach(token => {
      if (token.type === 'keyword' && token.value === 'import') {
        const importPath = this.extractImportPath(tokens);
        if (importPath) {
          imports.push(importPath);
        }
      }
    });

    if (currentModule) {
      this.modules.set(currentModule, new Set(imports));
    }
  }

  getModuleDependencies(): Map<string, Set<string>> {
    return this.modules;
  }

  private extractImportPath(tokens: Token[]): string | undefined {
    // Implementation for extracting import paths
    return undefined;
  }
}

// Add new interfaces for advanced type inference
interface ComplexTypeInfo extends TypeInfo {
  unionTypes?: string[];
  intersectionTypes?: string[];
  typeParameters?: Map<string, TypeInfo>;
  returnType?: TypeInfo;
  properties?: Map<string, TypeInfo>;
}

// Add quality metrics interface
interface CodeQualityMetrics {
  maintainability: {
    score: number;
    rating: 'A' | 'B' | 'C' | 'D' | 'F';
  };
  reliability: {
    bugRisk: number;
    duplications: number;
  };
  security: {
    vulnerabilities: number;
    securityHotspots: number;
  };
  testCoverage?: number;
}

export class EnhancedTypeInference extends TypeInference {
  private typeStack: ComplexTypeInfo[] = [];
  
  inferComplexTypes(tokens: Token[]): Map<string, ComplexTypeInfo> {
    const complexTypes = new Map<string, ComplexTypeInfo>();
    let currentContext: ComplexTypeInfo | undefined;

    tokens.forEach((token, index) => {
      if (this.isTypeDeclaration(token)) {
        currentContext = this.createTypeContext(tokens, index);
        if (currentContext) {
          complexTypes.set(token.value, currentContext);
        }
      }
    });

    return complexTypes;
  }

  private createTypeContext(tokens: Token[], startIndex: number): ComplexTypeInfo {
    return {
      type: tokens[startIndex].value,
      inferred: true,
      properties: this.inferProperties(tokens, startIndex),
      typeParameters: this.inferTypeParameters(tokens, startIndex)
    };
  }

  private inferProperties(tokens: Token[], startIndex: number): Map<string, TypeInfo> {
    const properties = new Map<string, TypeInfo>();
    // Implementation for property inference
    return properties;
  }
}

export class CircularDependencyDetector {
  private graph = new Map<string, Set<string>>();
  private visited = new Set<string>();
  private stack = new Set<string>();

  detectCircularDependencies(modules: Map<string, Set<string>>): string[][] {
    const cycles: string[][] = [];
    
    for (const [module] of modules) {
      if (!this.visited.has(module)) {
        this.dfs(module, modules, [], cycles);
      }
    }

    return cycles;
  }

  private dfs(
    current: string,
    modules: Map<string, Set<string>>,
    path: string[],
    cycles: string[][]
  ): void {
    this.visited.add(current);
    this.stack.add(current);
    path.push(current);

    const dependencies = modules.get(current) || new Set();
    for (const dep of dependencies) {
      if (!this.visited.has(dep)) {
        this.dfs(dep, modules, [...path], cycles);
      } else if (this.stack.has(dep)) {
        const cycleStart = path.indexOf(dep);
        cycles.push(path.slice(cycleStart));
      }
    }

    this.stack.delete(current);
  }
}

// Add new interfaces for security and code quality
interface SecurityPattern {
  pattern: RegExp;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'injection' | 'authentication' | 'encryption' | 'validation' | 'other';
}

interface CodeSmell {
  type: string;
  location: { start: number; end: number };
  severity: 'blocker' | 'critical' | 'major' | 'minor';
  description: string;
}

interface QualityThresholds {
  maintainability: { A: number; B: number; C: number; D: number };
  complexity: { method: number; class: number };
  duplications: number;
  coverage: number;
}

// Add after existing patterns
const securityPatterns: SecurityPattern[] = [
  {
    pattern: /eval\s*\(/,
    severity: 'critical',
    category: 'injection'
  },
  {
    pattern: /password\s*=\s*['"][^'"]*['"]/i,
    severity: 'high',
    category: 'authentication'
  },
  {
    pattern: /https?:\/\/[^'"]+/,
    severity: 'medium',
    category: 'validation'
  }
];

// Add language-specific security patterns
const languageSecurityPatterns: Record<string, SecurityPattern[]> = {
  python: [
    {
      pattern: /pickle\.loads?\(/,
      severity: 'critical',
      category: 'injection'
    },
    {
      pattern: /subprocess\.(?:call|Popen|run)\(/,
      severity: 'high',
      category: 'injection'
    }
  ],
  javascript: [
    {
      pattern: /document\.write\(/,
      severity: 'high',
      category: 'injection'
    },
    {
      pattern: /localStorage\.setItem\(\s*['"]token['"]/,
      severity: 'medium',
      category: 'authentication'
    }
  ],
  php: [
    {
      pattern: /\$_GET|\$_POST|\$_REQUEST/,
      severity: 'high',
      category: 'validation'
    },
    {
      pattern: /mysql_query|mysqli_query/,
      severity: 'critical',
      category: 'injection'
    }
  ]
};

// Add ML-based code smell detection
interface MLCodeSmellConfig {
  modelPath: string;
  threshold: number;
  features: string[];
}

export class MLCodeSmellDetector extends EnhancedCodeSmellDetector {
  private model: any; // TensorFlow or ONNX model would be loaded here
  private featureExtractor: FeatureExtractor;

  constructor(config: MLCodeSmellConfig) {
    super();
    this.featureExtractor = new FeatureExtractor(config.features);
  }

  async detectSmellsWithML(tokens: Token[]): Promise<AdvancedCodeSmell[]> {
    const features = this.featureExtractor.extract(tokens);
    const predictions = await this.model.predict(features);
    return this.interpretPredictions(predictions, tokens);
  }

  private interpretPredictions(predictions: number[], tokens: Token[]): AdvancedCodeSmell[] {
    return predictions
      .map((prob, index) => this.createSmellFromPrediction(prob, tokens[index]))
      .filter(smell => smell !== null) as AdvancedCodeSmell[];
  }
}

// Add rule prioritization and filtering
interface RulePriority {
  level: number;
  tags: string[];
  conditions: ((token: Token) => boolean)[];
}

export class RulePriorityManager {
  private priorities = new Map<string, RulePriority>();
  private filters: ((rule: SecurityPattern) => boolean)[] = [];

  setPriority(ruleName: string, priority: RulePriority): void {
    this.priorities.set(ruleName, priority);
  }

  addFilter(filter: (rule: SecurityPattern) => boolean): void {
    this.filters.push(filter);
  }

  sortRulesByPriority(rules: SecurityPattern[]): SecurityPattern[] {
    return rules.sort((a, b) => {
      const priorityA = this.getPriorityLevel(a);
      const priorityB = this.getPriorityLevel(b);
      return priorityB - priorityA;
    });
  }

  filterRules(rules: SecurityPattern[]): SecurityPattern[] {
    return rules.filter(rule => 
      this.filters.every(filter => filter(rule))
    );
  }

  private getPriorityLevel(rule: SecurityPattern): number {
    const priority = Array.from(this.priorities.values())
      .find(p => p.conditions.every(condition => condition(rule)));
    return priority?.level || 0;
  }
}

export class CodeSmellDetector {
  private smells: CodeSmell[] = [];

  detectSmells(tokens: Token[]): CodeSmell[] {
    this.detectLongMethods(tokens);
    this.detectDuplicateCode(tokens);
    this.detectComplexConditions(tokens);
    this.detectLargeClass(tokens);
    return this.smells;
  }

  private detectLongMethods(tokens: Token[]): void {
    let methodLines = 0;
    let methodStart = 0;

    tokens.forEach(token => {
      if (token.type === 'function') {
        methodStart = token.line;
      }
      if (methodLines > 30) {
        this.smells.push({
          type: 'LongMethod',
          location: { start: methodStart, end: token.line },
          severity: 'major',
          description: `Method is too long (${methodLines} lines)`
        });
      }
    });
  }

  // Add other smell detection methods...
}

export class QualityMetricsConfig {
  private static instance: QualityMetricsConfig;
  private thresholds: QualityThresholds = {
    maintainability: { A: 90, B: 80, C: 70, D: 60 },
    complexity: { method: 10, class: 20 },
    duplications: 3,
    coverage: 80
  };

  static getInstance(): QualityMetricsConfig {
    if (!QualityMetricsConfig.instance) {
      QualityMetricsConfig.instance = new QualityMetricsConfig();
    }
    return QualityMetricsConfig.instance;
  }

  setThresholds(newThresholds: Partial<QualityThresholds>): void {
    this.thresholds = { ...this.thresholds, ...newThresholds };
  }

  getThresholds(): QualityThresholds {
    return this.thresholds;
  }
}

// Update calculateCodeQuality function
export function calculateCodeQuality(tokens: Token[]): CodeQualityMetrics {
  const metrics = calculateAdvancedMetrics(tokens);
  const duplications = detectDuplications(tokens);
  const securityAnalyzer = new SecurityAnalyzer();
  securityAnalyzer.analyzeCode(tokens);
  const securityReport = securityAnalyzer.getSecurityReport();
  const smellDetector = new CodeSmellDetector();
  const codeSmells = smellDetector.detectSmells(tokens);
  const thresholds = QualityMetricsConfig.getInstance().getThresholds();

  return {
    maintainability: {
      score: metrics.maintainabilityIndex,
      rating: getMaintainabilityRating(metrics.maintainabilityIndex, thresholds.maintainability)
    },
    reliability: {
      bugRisk: calculateBugRisk(metrics, codeSmells),
      duplications: duplications.percentage
    },
    security: {
      vulnerabilities: securityReport.findings.size,
      securityHotspots: securityReport.riskScore
    }
  };
}

function getMaintainabilityRating(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}