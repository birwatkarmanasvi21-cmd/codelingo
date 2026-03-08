import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Search, AlertTriangle, CheckCircle2, Lightbulb, ArrowRight, X } from 'lucide-react';

interface AICodeAnalyzerScreenProps {
  onBack: () => void;
}

interface AnalysisResult {
  errors: { line: number; message: string; severity: 'error' | 'warning' }[];
  suggestions: string[];
  fixedCode: string;
}

export function AICodeAnalyzerScreen({ onBack }: AICodeAnalyzerScreenProps) {
  const [code, setCode] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyzeCode = async () => {
    if (!code.trim()) return;

    setIsAnalyzing(true);

    try {
      const response = await fetch(
        "https://r2yweyjn7f.execute-api.us-east-1.amazonaws.com/prod/interview",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "analyze-code",
            code,
          }),
        }
      );

      const data = await response.json();
      const result: AnalysisResult =
        typeof data.body === "string" ? JSON.parse(data.body) : data;

      if (
        Array.isArray(result.errors) &&
        Array.isArray(result.suggestions) &&
        typeof result.fixedCode === "string"
      ) {
        setResult(result);
      } else {
        setResult({
          errors: [
            {
              line: 0,
              message:
                "We could not analyze your code right now. Please try again.",
              severity: "warning",
            },
          ],
          suggestions: ["Check your internet connection or try again."],
          fixedCode: code,
        });
      }
    } catch {
      setResult({
        errors: [
          {
            line: 0,
            message:
              "We could not analyze your code right now. Please try again.",
            severity: "warning",
          },
        ],
        suggestions: ["Check your internet connection or try again."],
        fixedCode: code,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-4 pb-24 space-y-6 slide-up">
      {/* Close button */}
      <div className="flex justify-end -mt-2 -mr-2 mb-2">
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-muted tap-target"
          aria-label="Back to home"
        >
          <X className="w-6 h-6 text-muted-foreground" />
        </button>
      </div>

      {/* Header */}
      <div className="text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-4">
          <Search className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-2xl font-black text-foreground">AI Code Analyzer</h1>
        <p className="text-muted-foreground mt-1">Paste your code and get instant feedback</p>
      </div>

      {/* Code Input */}
      <Card className="p-4">
        <Textarea
          placeholder="// Paste your code here...
function example() {
  var x = 5;
  if (x == 5) {
    console.log('Hello');
  }
}"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="min-h-40 font-mono text-sm bg-code-bg text-correct resize-none"
        />
      </Card>

      {/* Analyze Button */}
      <Button
        onClick={analyzeCode}
        disabled={!code.trim() || isAnalyzing}
        className="w-full h-14 text-lg font-bold game-button"
      >
        {isAnalyzing ? (
          <>
            <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
            Analyzing...
          </>
        ) : (
          <>
            <Search className="w-5 h-5 mr-2" />
            Analyze Code
          </>
        )}
      </Button>

      {/* Results */}
      {result && (
        <div className="space-y-4 slide-up">
          {/* Errors/Warnings */}
          <Card className="p-4">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-xp" />
              Issues Found
            </h3>
            <div className="space-y-2">
              {result.errors.map((error, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    error.severity === 'error' 
                      ? 'bg-incorrect/10 border border-incorrect/30' 
                      : 'bg-xp/10 border border-xp/30'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {error.message.includes('No obvious issues') ? (
                      <CheckCircle2 className="w-5 h-5 text-correct flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        error.severity === 'error' ? 'text-incorrect' : 'text-xp'
                      }`} />
                    )}
                    <div>
                      {error.line > 0 && (
                        <span className="text-xs text-muted-foreground">Line {error.line}</span>
                      )}
                      <p className="text-sm">{error.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Suggestions */}
          <Card className="p-4 bg-accent/10 border-accent/30">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-xp" />
              AI Suggestions
            </h3>
            <ul className="space-y-2">
              {result.suggestions.map((suggestion, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <span className="text-accent">💡</span>
                  {suggestion}
                </li>
              ))}
            </ul>
          </Card>

          {/* Fixed Code */}
          {result.fixedCode !== code && (
            <Card className="p-4">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-correct" />
                Suggested Fix
              </h3>
              <div className="p-3 bg-code-bg rounded-lg">
                <pre className="text-sm font-mono text-correct whitespace-pre-wrap">
                  {result.fixedCode}
                </pre>
              </div>
            </Card>
          )}

          {/* Try Similar */}
          <Button variant="outline" className="w-full h-12 gap-2">
            Try a Similar Problem
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
