
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const apiKeySchema = z.object({
  apiKey: z.string().min(10, {
    message: "La clé API doit comporter au moins 10 caractères"
  })
});

type FormValues = z.infer<typeof apiKeySchema>;

const GeminiApiKeyForm = () => {
  const [isApiKeySaved, setIsApiKeySaved] = useState(
    localStorage.getItem("gemini_api_key") ? true : false
  );
  
  const form = useForm<FormValues>({
    resolver: zodResolver(apiKeySchema),
    defaultValues: {
      apiKey: ""
    },
  });

  const onSubmit = (data: FormValues) => {
    localStorage.setItem("gemini_api_key", data.apiKey);
    toast.success("Clé API Gemini enregistrée avec succès");
    setIsApiKeySaved(true);
    form.reset();
  };

  const removeApiKey = () => {
    localStorage.removeItem("gemini_api_key");
    toast.info("Clé API Gemini supprimée");
    setIsApiKeySaved(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Configuration API Gemini</CardTitle>
        <CardDescription>
          Ajoutez votre clé API Gemini pour activer l'analyse des aliments par IA
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isApiKeySaved ? (
          <div className="space-y-4">
            <div className="bg-green-50 p-3 rounded-md border border-green-200 text-green-800">
              <p className="text-sm">Une clé API Gemini est déjà configurée ✓</p>
            </div>
            <Button onClick={removeApiKey} variant="destructive" size="sm">
              Supprimer la clé API
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="apiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Clé API Gemini</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Entrez votre clé API Gemini"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Votre clé sera stockée localement et ne sera jamais partagée
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Enregistrer la clé</Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};

export default GeminiApiKeyForm;
