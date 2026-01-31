import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { DesignSystemResult } from "@/lib/scraper/types";

interface JsonViewerProps {
  result: DesignSystemResult;
}

export function JsonViewer({ result }: JsonViewerProps) {
  const [jsonCopied, setJsonCopied] = useState(false);

  return (
    <div className="mt-8 pt-8 border-t border-border/30">
      <Tabs defaultValue="hidden" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="bg-transparent border-0 shadow-none h-auto p-0">
            <TabsTrigger
              value="raw"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors bg-transparent shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary underline-offset-4 data-[state=active]:underline"
            >
              View Raw JSON Data
            </TabsTrigger>
          </TabsList>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs gap-1.5"
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(result, null, 2));
              setJsonCopied(true);
              setTimeout(() => setJsonCopied(false), 2000);
            }}
          >
            {jsonCopied ? (
              <>
                <Check className="w-3 h-3" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                Copy JSON
              </>
            )}
          </Button>
        </div>

        <TabsContent value="raw">
          <div className="rounded-2xl overflow-hidden border border-border/50">
            <SyntaxHighlighter
              language="json"
              style={oneDark}
              customStyle={{
                margin: 0,
                padding: "1.5rem",
                fontSize: "12px",
                lineHeight: "1.6",
                maxHeight: "400px",
                borderRadius: "1rem",
              }}
              showLineNumbers
            >
              {JSON.stringify(result, null, 2)}
            </SyntaxHighlighter>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
