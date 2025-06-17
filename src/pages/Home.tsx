"use client";

import { useState } from "react";
import { Copy, ExternalLink, RotateCcw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function Home() {
  const [phone, setPhone] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [generatedLink, setGeneratedLink] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const generateWhatsAppLink = (): void => {
    if (!phone.trim()) {
      toast.error("Por favor, insira um número de telefone.", {
        description: "O número é obrigatório para gerar o link.",
        duration: 3000,
      });
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      const cleanPhone = phone.replace(/\D/g, "");
      const encodedMessage = encodeURIComponent(message.trim());
      const link = `https://wa.me/55${cleanPhone}${
        encodedMessage ? `?text=${encodedMessage}` : ""
      }`;
      setGeneratedLink(link);
      setIsGenerating(false);

      toast.success("Link gerado com sucesso!", {
        description: "Seu link do WhatsApp está pronto para uso.",
        duration: 4000,
      });
    }, 1000);
  };

  const copyToClipboard = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      toast.success("Link copiado!", {
        description: "O link foi copiado para sua área de transferência.",
        duration: 3000,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Erro ao copiar", {
        description: "Não foi possível copiar o link.",
        duration: 3000,
      });
    }
  };

  const openWhatsApp = (): void => {
    window.open(generatedLink, "_blank");
    toast.info("Abrindo WhatsApp Web...", {
      description: "O link será aberto em uma nova aba.",
      duration: 2000,
    });
  };

  const resetForm = (): void => {
    setPhone("");
    setMessage("");
    setGeneratedLink("");
    setCopied(false);
    toast.info("Formulário resetado", {
      description: "Todos os campos foram limpos.",
      duration: 2000,
    });
  };

  const formatPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length === 0) return "";

    if (numbers.length <= 10) {
      return numbers
        .replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3")
        .replace(/-$/, "");
    }

    if (numbers.length === 11) {
      return numbers.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
    }

    return numbers;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Zink - Gerador de Link para WhatsApp",
          text: "Confira essa ferramenta incrível para gerar links do WhatsApp rapidamente!",
          url: window.location.href,
        });
        toast.success("Compartilhado com sucesso!");
      } catch {
        toast.error("Falha ao compartilhar.");
      }
    } else {
      toast.error("Compartilhamento não suportado neste navegador.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-[#25D366] to-[#128C7E] bg-clip-text text-transparent">
            Zink
          </h1>
          <p className="font-heading text-xl md:text-2xl text-gray-700 mb-3 font-semibold">
            Gerador de Link para WhatsApp
          </p>
          <p className="font-body text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Crie um link de atendimento com mensagem personalizada e QR Code em
            segundos.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Form Section */}
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-md ring-1 ring-gray-200/50">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label
                    htmlFor="phone"
                    className="font-heading text-sm font-semibold text-gray-800"
                  >
                    Número de telefone com DDD
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Ex: (11) 99999-9999"
                    value={formatPhone(phone)}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, ""))
                    }
                    className="h-12 text-lg font-body border-gray-200 focus:border-[#25D366] focus:ring-[#25D366] focus:ring-2 transition-all duration-200"
                    maxLength={15}
                  />
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="message"
                    className="font-heading text-sm font-semibold text-gray-800"
                  >
                    Mensagem padrão (opcional)
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Ex: Olá! Gostaria de mais informações."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[100px] text-lg font-body border-gray-200 focus:border-[#25D366] focus:ring-[#25D366] focus:ring-2 resize-none transition-all duration-200"
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 text-right font-body">
                    {message.length}/500 caracteres
                  </p>
                </div>

                <Button
                  onClick={generateWhatsAppLink}
                  disabled={isGenerating}
                  className="w-full h-14 text-lg font-heading font-bold bg-gradient-to-r from-[#25D366] to-[#20B858] hover:from-[#20B858] hover:to-[#1DA851] text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isGenerating ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Gerando link...
                    </div>
                  ) : (
                    "Gerar link"
                  )}
                </Button>

                {generatedLink && (
                  <Button
                    onClick={resetForm}
                    variant="outline"
                    className="w-full h-12 font-heading font-medium text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Resetar formulário
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          {generatedLink && (
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-md ring-1 ring-gray-200/50 animate-in slide-in-from-right duration-500">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <h3 className="font-heading text-xl font-bold text-gray-900 text-center">
                    Seu link está pronto! 🎉
                  </h3>

                  {/* Generated Link */}
                  <div className="space-y-3">
                    <Label className="font-heading text-sm font-semibold text-gray-800">
                      Link gerado:
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={generatedLink}
                        readOnly
                        className="flex-1 bg-gray-50 border-gray-200 text-sm font-body font-medium"
                      />
                      <Button
                        onClick={copyToClipboard}
                        variant="outline"
                        size="icon"
                        className="shrink-0 border-gray-300 hover:bg-gray-50 hover:border-[#25D366] transition-all duration-200"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 gap-3">
                    <Button
                      onClick={openWhatsApp}
                      className="h-12 font-heading font-semibold bg-gradient-to-r from-[#25D366] to-[#20B858] hover:from-[#20B858] hover:to-[#1DA851] text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Abrir no WhatsApp Web
                    </Button>
                  </div>

                  {/* QR Code */}
                  <div className="text-center space-y-4">
                    <div className="bg-white p-6 rounded-xl border-2 border-gray-100 inline-block shadow-sm">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=192x192&data=${encodeURIComponent(
                          generatedLink
                        )}`}
                        alt="QR Code"
                        width={192}
                        height={192}
                        className="mx-auto"
                      />
                    </div>
                    <p className="text-sm text-gray-700 font-heading font-semibold">
                      📱 Escaneie com o celular
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <div className="space-y-4">
            <p className="text-gray-600 text-sm font-body">
              Feito com ❤️ para facilitar seu atendimento no WhatsApp
            </p>
            <Button
              variant="outline"
              onClick={handleShare}
              className="font-heading font-semibold text-[#25D366] border-[#25D366] hover:bg-[#25D366] hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              Compartilhar Zink
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
}
