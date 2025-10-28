import { Card } from "./ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { HelpCircle, Wallet, TrendingUp, Target, BarChart3, Download, Upload, CreditCard } from "lucide-react";

export function HelpGuide() {
  const faqs = [
    {
      question: "How do I get started?",
      answer: "Start by setting your monthly budget and income in the Dashboard tab. Then add your expenses using the Expenses tab. The app will automatically track your spending and show you insights.",
      icon: Wallet
    },
    {
      question: "What are the different tabs for?",
      answer: "Dashboard shows your overview and key metrics. Expenses is where you add and manage transactions. Analytics provides detailed charts and reports. Goals lets you set savings targets. Settings contains data management options.",
      icon: BarChart3
    },
    {
      question: "How do I export my data?",
      answer: "Go to the Settings tab and use the Data Management section. You can export your data as JSON (complete backup) or CSV (for spreadsheet analysis). Regular backups are recommended.",
      icon: Download
    },
    {
      question: "Can I import data from another device?",
      answer: "Yes! Export your data from the other device as JSON, then use the Import feature in Settings to load it. This is useful when switching devices or browsers.",
      icon: Upload
    },
    {
      question: "How do savings goals work?",
      answer: "In the Goals tab, click 'Add Goal' to create a new savings target. Enter the goal name, target amount, and optional deadline. Update your progress regularly to track how close you are to achieving your goal.",
      icon: Target
    },
    {
      question: "What insights does the app provide?",
      answer: "The app shows spending trends, category breakdowns, daily averages, projections, month-over-month comparisons, and personalized tips to help you manage your finances better.",
      icon: TrendingUp
    },
    {
      question: "Is my data safe?",
      answer: "All your data is stored locally in your browser using localStorage. Nothing is sent to any server. Your financial information stays completely private on your device.",
      icon: HelpCircle
    },
    {
      question: "Can I use different currencies?",
      answer: "Yes! The app supports 20 major world currencies. Use the currency selector in the header to switch between currencies. Your preference is saved automatically.",
      icon: Wallet
    },
    {
      question: "How do I filter and search expenses?",
      answer: "In the Expenses tab, use the search bar to find specific transactions by description. Click the filter icon to filter by category or date range. This makes it easy to review specific types of spending.",
      icon: BarChart3
    },
    {
      question: "What should I do if I clear my browser data?",
      answer: "If you clear browser data, all your expenses will be lost unless you've exported them. Regular exports are recommended as a backup. You can then import the data back anytime.",
      icon: Download
    },
    {
      question: "How do EMI payments work?",
      answer: "When adding an expense, turn on the 'EMI toggle' to mark it as an installment. Set the end date, and the app will track it on your dashboard. You'll see how many months are left and get alerts when it's ending soon.",
      icon: CreditCard
    },
    {
      question: "How do I view my profile?",
      answer: "Click on your avatar in the top-right corner or go to the Profile tab. Here you can update your name, email, change your password, and logout from your account.",
      icon: Wallet
    }
  ];

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
        <p className="text-sm text-orange-900 dark:text-orange-100">
          📖 Learn how to use the app and manage your finances effectively
        </p>
      </div>

    <Card className="p-6 shadow-xl">
      <h3 className="flex items-center gap-2 mb-6">
        <HelpCircle className="w-5 h-5" />
        Help & Guide
      </h3>

      <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h4 className="mb-3 text-blue-900 dark:text-blue-100">📖 Easy 5-Step Guide for Beginners</h4>
        <ol className="space-y-3 text-sm">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">1</span>
            <span className="text-blue-900 dark:text-blue-100">
              <strong>Set Your Income:</strong> Enter how much money you earn each month
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">2</span>
            <span className="text-blue-900 dark:text-blue-100">
              <strong>Set Your Budget:</strong> Decide how much you want to spend this month
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">3</span>
            <span className="text-blue-900 dark:text-blue-100">
              <strong>Add Expenses:</strong> Every time you spend money, add it with a category
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">4</span>
            <span className="text-blue-900 dark:text-blue-100">
              <strong>Track EMIs:</strong> Turn on EMI toggle for monthly installment payments
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">5</span>
            <span className="text-blue-900 dark:text-blue-100">
              <strong>Check Dashboard:</strong> See colorful charts showing where your money goes
            </span>
          </li>
        </ol>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => {
          const Icon = faq.icon;
          return (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {faq.question}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground pl-6">
                  {faq.answer}
                </p>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
        <h4 className="text-green-700 dark:text-green-300 mb-3">💡 Simple Tips for Success</h4>
        <ul className="space-y-2 text-sm text-green-900 dark:text-green-100">
          <li>✓ <strong>Start Small:</strong> Don't worry about tracking every penny at first</li>
          <li>✓ <strong>Be Consistent:</strong> Add expenses daily, it only takes 30 seconds</li>
          <li>✓ <strong>Check Weekly:</strong> Look at your dashboard once a week</li>
          <li>✓ <strong>Save Regularly:</strong> Try to save at least 20% of your income</li>
          <li>✓ <strong>Backup Monthly:</strong> Export your data once a month just in case</li>
          <li>✓ <strong>Set Alerts:</strong> The app warns you when you're overspending</li>
        </ul>
      </div>
    </Card>
    </div>
  );
}
