
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Copy } from 'lucide-react';
import { DiscordView } from './DiscordTypes';
import { generateDiscordCode } from './utils';

interface CodeDialogProps {
  views: DiscordView[];
  showCodeDialog: boolean;
  setShowCodeDialog: (show: boolean) => void;
}

const CodeDialog: React.FC<CodeDialogProps> = ({
  views,
  showCodeDialog,
  setShowCodeDialog
}) => {
  const generatedCode = generateDiscordCode(views);

  return (
    <Dialog open={showCodeDialog} onOpenChange={setShowCodeDialog}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Generated Code</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex justify-between">
            <h3 className="font-semibold">Menu Configuration (JSON)</h3>
            <Button onClick={() => navigator.clipboard.writeText(generatedCode.json)} size="sm">
              <Copy className="mr-2 h-4 w-4" />
              Copy JSON
            </Button>
          </div>
          <pre className="bg-slate-800 text-gray-100 p-4 rounded-md overflow-auto max-h-40">
            {generatedCode.json}
          </pre>
          
          <div className="flex justify-between">
            <h3 className="font-semibold">JavaScript Implementation (Discord.js)</h3>
            <Button onClick={() => navigator.clipboard.writeText(generatedCode.javascript)} size="sm">
              <Copy className="mr-2 h-4 w-4" />
              Copy JavaScript
            </Button>
          </div>
          <pre className="bg-slate-800 text-gray-100 p-4 rounded-md overflow-auto max-h-60">
            {generatedCode.javascript}
          </pre>
          
          <div className="flex justify-between">
            <h3 className="font-semibold">Python Implementation (discord.py)</h3>
            <Button onClick={() => navigator.clipboard.writeText(generatedCode.python)} size="sm">
              <Copy className="mr-2 h-4 w-4" />
              Copy Python
            </Button>
          </div>
          <pre className="bg-slate-800 text-gray-100 p-4 rounded-md overflow-auto max-h-60">
            {generatedCode.python}
          </pre>
          
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Instructions to Run</h3>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
              <p className="font-medium">For Python (discord.py):</p>
              <ol className="list-decimal pl-5 mt-2 space-y-2 text-sm">
                <li>Create a file named <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">bot.py</code> and paste the Python code.</li>
                <li>Create a <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">.env</code> file with your Discord bot token: <br/>
                  <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">DISCORD_TOKEN=your_token_here</code>
                </li>
                <li>Install required packages: <br/>
                  <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">pip install discord.py python-dotenv</code>
                </li>
                <li>Run the bot: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">python bot.py</code></li>
              </ol>
              
              <p className="font-medium mt-4">For JavaScript (Discord.js):</p>
              <ol className="list-decimal pl-5 mt-2 space-y-2 text-sm">
                <li>Create a file named <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">bot.js</code> and paste the JavaScript code.</li>
                <li>Create a <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">.env</code> file with your Discord bot token: <br/>
                  <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">DISCORD_TOKEN=your_token_here</code>
                </li>
                <li>Initialize npm and install required packages: <br/>
                  <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">npm init -y<br/>npm install discord.js dotenv</code>
                </li>
                <li>Run the bot: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">node bot.js</code></li>
              </ol>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CodeDialog;
