
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Check, 
  ChevronRight,
  Database, 
  Mail, 
  Brain,
  Loader2
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface SetupStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  fields: {
    id: string;
    label: string;
    type: string;
    placeholder: string;
    required?: boolean;
  }[];
}

// Define setup steps
const setupSteps: SetupStep[] = [
  {
    id: "mysql",
    title: "MySQL Database",
    description: "Configure your MySQL database connection",
    icon: Database,
    fields: [
      {
        id: "mysql_host",
        label: "Host",
        type: "text",
        placeholder: "localhost",
        required: true,
      },
      {
        id: "mysql_port",
        label: "Port",
        type: "number",
        placeholder: "3306",
        required: true,
      },
      {
        id: "mysql_database",
        label: "Database Name",
        type: "text",
        placeholder: "codewizard",
        required: true,
      },
      {
        id: "mysql_user",
        label: "Username",
        type: "text",
        placeholder: "root",
        required: true,
      },
      {
        id: "mysql_password",
        label: "Password",
        type: "password",
        placeholder: "••••••••",
        required: true,
      },
    ],
  },
  {
    id: "smtp",
    title: "Email (SMTP)",
    description: "Configure your email service for notifications",
    icon: Mail,
    fields: [
      {
        id: "smtp_host",
        label: "SMTP Host",
        type: "text",
        placeholder: "smtp.zoho.com",
        required: true,
      },
      {
        id: "smtp_port",
        label: "SMTP Port",
        type: "number",
        placeholder: "587",
        required: true,
      },
      {
        id: "smtp_user",
        label: "Email",
        type: "email",
        placeholder: "notifications@example.com",
        required: true,
      },
      {
        id: "smtp_password",
        label: "Password",
        type: "password",
        placeholder: "••••••••",
        required: true,
      },
      {
        id: "smtp_from",
        label: "From Address",
        type: "email",
        placeholder: "CodeWizard <notifications@example.com>",
        required: true,
      },
    ],
  },
  {
    id: "ollama",
    title: "Ollama Configuration",
    description: "Configure your Ollama API endpoint and models",
    icon: Brain,
    fields: [
      {
        id: "ollama_host",
        label: "Ollama API Endpoint",
        type: "text",
        placeholder: "http://localhost:11434",
        required: true,
      },
      {
        id: "ollama_model",
        label: "Default Model",
        type: "text",
        placeholder: "llama2",
        required: true,
      },
    ],
  },
];

export default function Setup() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, boolean>>({
    mysql: false,
    smtp: false,
    ollama: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const testConnection = async (type: string) => {
    setTestingConnection(true);
    
    // Simulate API call with some delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // In a real app, you'd call your backend API to test connections
    setTestResults((prev) => ({ ...prev, [type]: true }));
    setTestingConnection(false);
  };

  const isCurrentStepValid = () => {
    const currentFields = setupSteps[currentStep].fields;
    return currentFields.every(field => 
      !field.required || (formData[field.id] && formData[field.id].trim() !== '')
    );
  };

  const handleNext = () => {
    if (currentStep < setupSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit all configuration and redirect to dashboard
      finishSetup();
    }
  };

  const finishSetup = async () => {
    setTestingConnection(true);
    
    // Simulate API call with some delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // In a real app, you'd call your backend API to save the configuration
    // and run database migrations
    
    // Redirect to login page
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Welcome to CodeWizard</h1>
          <p className="text-muted-foreground mt-2">
            Complete this one-time setup to configure your installation.
          </p>
        </div>
        
        {/* Step indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {setupSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full",
                    currentStep === index
                      ? "bg-primary text-primary-foreground"
                      : currentStep > index
                      ? "bg-primary/90 text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  )}
                >
                  {currentStep > index ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                {index < setupSteps.length - 1 && (
                  <div
                    className={cn(
                      "h-1 w-10 md:w-16",
                      currentStep > index ? "bg-primary" : "bg-secondary"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2">
            <span className="text-sm font-medium">
              Step {currentStep + 1} of {setupSteps.length}: {setupSteps[currentStep].title}
            </span>
          </div>
        </div>
        
        {/* Current step */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{setupSteps[currentStep].title}</CardTitle>
            <CardDescription>{setupSteps[currentStep].description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {setupSteps[currentStep].fields.map((field) => (
                <div key={field.id} className="grid gap-2">
                  <Label htmlFor={field.id}>{field.label}</Label>
                  <Input
                    id={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formData[field.id] || ""}
                    onChange={handleInputChange}
                    required={field.required}
                  />
                </div>
              ))}
              
              <div className="mt-6">
                <Button
                  variant="outline"
                  onClick={() => testConnection(setupSteps[currentStep].id)}
                  disabled={testingConnection || !isCurrentStepValid()}
                  className="w-full"
                >
                  {testingConnection ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Testing connection...
                    </>
                  ) : testResults[setupSteps[currentStep].id] ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Connection successful
                    </>
                  ) : (
                    `Test ${setupSteps[currentStep].title} Connection`
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={!isCurrentStepValid()}
              className="gap-2"
            >
              {currentStep === setupSteps.length - 1 ? "Finish Setup" : "Next"}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
