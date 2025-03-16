import {
  tokenize,
  calculateMetrics,
  semanticAnalysis,
  MLCodeSmellDetector,
  RulePriorityManager
} from '../codeTokenizer';

describe('Code Tokenizer', () => {
  test('should tokenize TypeScript code correctly', () => {
    const code = `
      function test() {
        const x = 1;
        return x;
      }
    `;
    const tokens = tokenize(code, 'typescript');
    expect(tokens).toBeDefined();
    expect(tokens.length).toBeGreaterThan(0);
    expect(tokens[0].type).toBe('function');
  });

  test('should calculate metrics accurately', () => {
    const tokens = tokenize('function test() { if (true) { return 1; } }', 'typescript');
    const metrics = calculateMetrics(tokens);
    expect(metrics.cyclomaticComplexity).toBeGreaterThan(1);
    expect(metrics.maxNestingDepth).toBe(2);
  });

  test('should detect code smells', async () => {
    const detector = new MLCodeSmellDetector({
      modelPath: 'models/code-smell.onnx',
      threshold: 0.7,
      features: ['complexity', 'patterns']
    });
    const tokens = tokenize('function veryLongFunction() { /* ... */ }', 'typescript');
    const smells = await detector.detectSmellsWithML(tokens);
    expect(smells).toBeDefined();
  });
});