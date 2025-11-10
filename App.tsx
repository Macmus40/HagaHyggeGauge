
import React, { useState, useEffect, useMemo } from 'react';
import { GaugeSwatch } from './components/GaugeSwatch';
import { Input } from './components/Input';
import { Button } from './components/Button';
import { EaseSelector } from './components/EaseSelector';
import { LeafIcon } from './components/icons/LeafIcon';
import { translations } from './locales/translations';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { SupportButton } from './components/SupportButton';

declare global {
  interface Window {
    html2canvas: any;
    jspdf: any;
  }
}

interface Result {
  stitches: number;
  rows: number | null;
  gauge: number;
  gaugeRows: number | null;
}

interface CalculationSummary {
  width: string;
  height: string;
  circumference: string;
  targetHeight: string;
  adjustedCircumference: number;
  ease: Ease;
  useCase: string;
  result: Result;
}

type Language = 'en' | 'en-US' | 'es' | 'fr' | 'de';
export type Ease = 'snug' | 'exact' | 'loose';

const App: React.FC = () => {
  const [sampleWidth, setSampleWidth] = useState<string>('');
  const [sampleHeight, setSampleHeight] = useState<string>('');
  const [targetCircumference, setTargetCircumference] = useState<string>('');
  const [targetHeight, setTargetHeight] = useState<string>('');
  const [ease, setEase] = useState<Ease>('exact');
  
  const [result, setResult] = useState<Result | null>(null);
  const [calculationSummary, setCalculationSummary] = useState<CalculationSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showExampleDetails, setShowExampleDetails] = useState<boolean>(false);
  const [language, setLanguage] = useState<Language>('en');
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const [useCase, setUseCase] = useState<string>('');

  const t = (key: keyof typeof translations.en): string => {
    // @ts-ignore - language is a valid key
    return translations[language]?.[key] || translations.en[key];
  };

  const useCaseOptions = [
    t('use_case_hat'),
    t('use_case_sleeve'),
    t('use_case_basket'),
    t('use_case_cuff'),
    t('use_case_other')
  ];

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = 'ltr'; // All supported languages are LTR
    setUseCase(t('use_case_hat')); // Reset use case on language change
  }, [language]);

  const resetStateOnChange = () => {
    setResult(null);
    setError(null);
    setShowExampleDetails(false);
    setCalculationSummary(null);
  };
  
  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setSampleWidth('');
    setSampleHeight('');
    setTargetCircumference('');
    setTargetHeight('');
    setEase('exact');
    resetStateOnChange();
  };
  
  const adjustedCircumference = useMemo(() => {
    const baseCircumference = parseFloat(targetCircumference);
    if (isNaN(baseCircumference) || baseCircumference <= 0) return null;

    switch (ease) {
      case 'snug':
        return baseCircumference * 0.9;
      case 'loose':
        return baseCircumference * 1.15;
      case 'exact':
      default:
        return baseCircumference;
    }
  }, [targetCircumference, ease]);


  const handleCalculate = () => {
    resetStateOnChange();

    const width = parseFloat(sampleWidth);
    const height = parseFloat(sampleHeight);
    const desiredHeight = parseFloat(targetHeight);

    if (isNaN(width) || width <= 0) {
      setError(t('error_width'));
      return;
    }
    if (!adjustedCircumference) {
      setError(t('error_circumference'));
      return;
    }

    const stitches_per_unit = 10 / width;
    const required_stitches = Math.round(adjustedCircumference * stitches_per_unit);
    
    let required_rows: number | null = null;
    let rows_per_unit: number | null = null;
    
    if (!isNaN(height) && height > 0 && !isNaN(desiredHeight) && desiredHeight > 0) {
      rows_per_unit = 10 / height;
      required_rows = Math.round(desiredHeight * rows_per_unit);
    }

    const newResult: Result = {
      stitches: required_stitches,
      rows: required_rows,
      gauge: parseFloat(stitches_per_unit.toFixed(2)),
      gaugeRows: rows_per_unit ? parseFloat(rows_per_unit.toFixed(2)) : null,
    };

    setResult(newResult);
    setCalculationSummary({
      width: sampleWidth,
      height: sampleHeight,
      circumference: targetCircumference,
      targetHeight: targetHeight,
      adjustedCircumference: adjustedCircumference,
      ease: ease,
      useCase: useCase,
      result: newResult,
    });
  };

  const handleShowExample = () => {
    resetStateOnChange();
    let summary: CalculationSummary;
    const exampleUseCase = t('use_case_hat');
    setUseCase(exampleUseCase);
    setEase('snug');

    if (language === 'en-US') {
      const circ = 21;
      const adjCirc = circ * 0.9;
      const height = 7;
      const newResult = {
        stitches: 63,
        rows: 28,
        gauge: parseFloat((10 / 3).toFixed(2)),
        gaugeRows: parseFloat((10 / 2.5).toFixed(2)),
      };
      setSampleWidth('3');
      setSampleHeight('2.5');
      setTargetCircumference(circ.toString());
      setTargetHeight(height.toString());
      setResult(newResult);
      summary = { width: '3', height: '2.5', circumference: circ.toString(), targetHeight: height.toString(), adjustedCircumference: adjCirc, ease: 'snug', useCase: exampleUseCase, result: newResult };
    } else {
      const circ = 53;
      const adjCirc = circ * 0.9;
      const height = 18;
      const newResult = {
        stitches: 60,
        rows: 30,
        gauge: 1.25,
        gaugeRows: parseFloat((10/6).toFixed(2))
      };
      setSampleWidth('8');
      setSampleHeight('6');
      setTargetCircumference(circ.toString());
      setTargetHeight(height.toString());
      setResult(newResult);
      summary = { width: '8', height: '6', circumference: circ.toString(), targetHeight: height.toString(), adjustedCircumference: adjCirc, ease: 'snug', useCase: exampleUseCase, result: newResult };
    }
    setCalculationSummary(summary);
    setShowExampleDetails(true);
  };
  
  const handlePrint = async () => {
    setIsPrinting(true);
    const { jsPDF } = window.jspdf;
    const html2canvas = window.html2canvas;
    const printElement = document.getElementById('print-summary');
  
    if (printElement && html2canvas) {
      // Temporarily make the element visible for rendering off-screen
      const originalStyles = {
        display: printElement.style.display,
        position: printElement.style.position,
        left: printElement.style.left,
        top: printElement.style.top,
      };
      printElement.style.display = 'block';
      printElement.style.position = 'absolute';
      printElement.style.left = '-9999px';
      printElement.style.top = '0px';
  
      try {
        const canvas = await html2canvas(printElement, {
          scale: 2, // Improve resolution
          useCORS: true,
          backgroundColor: '#ffffff',
        });
        
        // Restore original styles immediately after capture
        printElement.style.display = originalStyles.display;
        printElement.style.position = originalStyles.position;
        printElement.style.left = originalStyles.left;
        printElement.style.top = originalStyles.top;
  
        const imgData = canvas.toDataURL('image/png');
        
        // Create a PDF with dimensions matching the captured canvas
        const pdf = new jsPDF({
          orientation: canvas.width > canvas.height ? 'l' : 'p',
          unit: 'px',
          format: [canvas.width, canvas.height],
        });
  
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save('HagaHygge-Crochet-Summary.pdf');
  
      } catch (error) {
        console.error("Failed to generate PDF", error);
        // Ensure styles are restored on error
        printElement.style.display = originalStyles.display;
        printElement.style.position = originalStyles.position;
        printElement.style.left = originalStyles.left;
        printElement.style.top = originalStyles.top;
      }
    } else {
      console.error("Could not find element to print or PDF libraries are not loaded.");
    }
  
    setIsPrinting(false);
  };


  return (
    <>
      <div className="min-h-screen font-sans text-brand-text flex flex-col items-center justify-center p-4 sm:p-6 no-print">
        <div className="w-full max-w-2xl mx-auto">
          <div className="flex justify-end items-center mb-4 gap-2">
            <LanguageSwitcher currentLang={language} setLang={handleLanguageChange} />
            <ThemeSwitcher />
          </div>
          <header className="text-center mb-8">
            <img 
              src="https://i.etsystatic.com/57952380/r/isla/7f23f0/76985884/isla_100x100.76985884_dsjcxq9k.jpg" 
              alt="HagaHygge Logo"
              className="mx-auto mb-4 w-20 h-20 rounded-full object-cover shadow-md border-2 border-brand-soft-accent transform hover:scale-105 transition-transform duration-300"
            />
            <h1 className="text-3xl sm:text-4xl font-light text-brand-accent mb-2">{t('app_title')}</h1>
            <p className="text-base sm:text-lg max-w-xl mx-auto">
              {t('app_description')}
            </p>
          </header>

          <main className="space-y-6">
            <div className="bg-brand-subtle-bg rounded-2xl shadow-sm p-6 sm:p-8">
              <h2 className="text-xl font-normal text-brand-accent mb-6">{t('swatch_title')}</h2>
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                <div className="flex-shrink-0 w-48 h-48 flex items-center justify-center">
                  <GaugeSwatch 
                    stitchesLabel={t('label_10_stitches')} 
                    rowsLabel={t('label_10_rows')} 
                    width={sampleWidth}
                    height={sampleHeight}
                  />
                </div>
                <div className="w-full space-y-4">
                  <Input
                    label={t('swatch_width_label')}
                    id="sample-width"
                    type="number"
                    placeholder={t('swatch_width_placeholder')}
                    value={sampleWidth}
                    onChange={(e) => {
                      setSampleWidth(e.target.value);
                      resetStateOnChange();
                    }}
                  />
                  <Input
                    label={t('swatch_height_label')}
                    id="sample-height"
                    type="number"
                    placeholder={t('swatch_height_placeholder')}
                    value={sampleHeight}
                    onChange={(e) => {
                      setSampleHeight(e.target.value);
                      resetStateOnChange();
                    }}
                  />
                </div>
              </div>
              <p className="text-sm text-center md:text-start text-brand-primary mt-6">
                {t('swatch_instructions')}
              </p>
            </div>

            <div className="bg-brand-subtle-bg rounded-2xl shadow-sm p-6 sm:p-8">
              <h2 className="text-xl font-normal text-brand-accent mb-6">{t('project_title')}</h2>
              <div className="space-y-6">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label={t('project_circumference_label')}
                      id="target-circumference"
                      type="number"
                      placeholder={t('project_circumference_placeholder')}
                      value={targetCircumference}
                      onChange={(e) => {
                        setTargetCircumference(e.target.value);
                        resetStateOnChange();
                      }}
                    />
                    <Input
                      label={t('project_height_label')}
                      id="target-height"
                      type="number"
                      placeholder={t('project_height_placeholder')}
                      value={targetHeight}
                      onChange={(e) => {
                        setTargetHeight(e.target.value);
                        resetStateOnChange();
                      }}
                    />
                </div>
                <div>
                    <label htmlFor="use-case" className="block text-sm font-medium text-brand-text mb-1">{t('use_case_label')}</label>
                    <select 
                      id="use-case" 
                      name="use-case" 
                      className="w-full bg-brand-bg border border-brand-soft-accent text-brand-text rounded-lg p-3 focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition"
                      value={useCase}
                      onChange={(e) => {
                        setUseCase(e.target.value);
                        resetStateOnChange();
                      }}
                    >
                        {useCaseOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
                <EaseSelector 
                  currentEase={ease}
                  setEase={(newEase) => {
                    setEase(newEase);
                    resetStateOnChange();
                  }}
                  baseCircumference={targetCircumference}
                  adjustedCircumference={adjustedCircumference}
                  t={t}
                />
              </div>

              <div className="mt-8 text-center">
                  <Button onClick={handleCalculate}>{t('calculate_button')}</Button>
                  <p className="mt-4">
                      {t('show_example_pre')}{' '}
                      <button onClick={handleShowExample} className="text-brand-accent hover:underline focus:outline-none focus:ring-2 focus:ring-brand-accent rounded">
                          {t('show_example_link')}
                      </button>
                  </p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-2xl p-4 text-center transition-all duration-300">
                {error}
              </div>
            )}

            {result && !error && (
              <div className="bg-brand-result-bg text-brand-accent rounded-2xl p-6 sm:p-8 text-center">
                <h2 className="text-2xl font-light mb-2">{t('result_prefix')}</h2>
                <p className="text-5xl font-bold mb-4">{result.stitches} {t('result_suffix')}</p>
                
                {result.rows && (
                  <>
                    <p className="text-xl font-light mt-4">{t('result_rows_conjunction')}</p>
                    <p className="text-5xl font-bold mt-2 mb-4">{result.rows} {t('result_rows_suffix')}</p>
                  </>
                )}

                <div className="text-base text-brand-primary mt-6 mb-6">
                  <p>
                    {t('result_gauge_prefix')} <strong>{result.gauge}</strong> {t('result_gauge_value').replace('{gauge}', result.gauge.toString())}
                  </p>
                  {result.gaugeRows && (
                    <p className="mt-1">
                      {t('result_gauge_rows_prefix')} <strong>{result.gaugeRows}</strong> {t('result_gauge_rows_value').replace('{gauge}', result.gaugeRows.toString())}
                    </p>
                  )}
                </div>
                
                {showExampleDetails && (
                  <div className="text-start bg-brand-subtle-bg/60 p-4 rounded-lg text-sm text-brand-text mb-6 border border-brand-soft-accent">
                    <h3 className="font-semibold mb-2">{t('example_title')}</h3>
                    <p>{t('example_step1')} <span dangerouslySetInnerHTML={{ __html: t('example_step1_value') }} /></p>
                    <p>{t('example_step2')} <span dangerouslySetInnerHTML={{ __html: t('example_step2_value') }} /></p>
                    <p>{t('example_step3')} <span dangerouslySetInnerHTML={{ __html: t('example_step3_value') }} /></p>
                    {result.rows && (
                      <>
                        <p>{t('example_step4')} <span dangerouslySetInnerHTML={{ __html: t('example_step4_value') }} /></p>
                        <p>{t('example_step5')} <span dangerouslySetInnerHTML={{ __html: t('example_step5_value') }} /></p>
                      </>
                    )}
                  </div>
                )}

                <div className="mt-8 flex flex-col items-center gap-4">
                  <Button onClick={handlePrint} disabled={isPrinting}>
                    {isPrinting ? t('print_button_loading') : t('print_button')}
                  </Button>
                  <SupportButton kofiId="S6S41O8H4K" label={t('support_button')} />
                  <div className="flex items-center justify-center gap-2 text-sm text-brand-primary">
                    <LeafIcon className="w-4 h-4" />
                    <span>{t('tip')}</span>
                  </div>
                </div>
              </div>
            )}
          </main>
          <footer className="text-center text-sm text-brand-primary pt-8 pb-4">
            <p>{t('footer_text')}</p>
          </footer>
        </div>
      </div>
      {/* This element is now only used for PDF generation and is not displayed */}
      {calculationSummary && (
        <div id="print-summary">
            <header>
                <h1>{t('app_title')}</h1>
                <p className="print-header-sub">{t('print_title')}</p>
            </header>
            <div className="my-8">
                <strong>{t('print_date')}:</strong> {new Date().toLocaleDateString(language.replace('_', '-'))}
            </div>

            <div className="space-y-8">
                <section>
                    <h2 className="print-section-title">{t('print_inputs_title')}</h2>
                    <table>
                      <tbody>
                        <tr>
                          <td>{t('print_swatch_width')}:</td>
                          <td className="print-value">{calculationSummary.width} {language === 'en-US' ? t('unit_in') : t('unit_cm')}</td>
                        </tr>
                        {calculationSummary.height && (
                           <tr>
                            <td>{t('print_swatch_height')}:</td>
                            <td className="print-value">{calculationSummary.height} {language === 'en-US' ? t('unit_in') : t('unit_cm')}</td>
                          </tr>
                        )}
                        <tr>
                          <td>{t('print_circumference')}:</td>
                          <td className="print-value">{calculationSummary.circumference} {language === 'en-US' ? t('unit_in') : t('unit_cm')}</td>
                        </tr>
                        {calculationSummary.targetHeight && (
                          <tr>
                            <td>{t('print_target_height')}:</td>
                            <td className="print-value">{calculationSummary.targetHeight} {language === 'en-US' ? t('unit_in') : t('unit_cm')}</td>
                          </tr>
                        )}
                        <tr>
                          <td>{t('print_ease')}:</td>
                          <td className="print-value">{t(`ease_${calculationSummary.ease}_label`)} ({t(`ease_${calculationSummary.ease}_value`)})</td>
                        </tr>
                        <tr>
                          <td>{t('print_adjusted_circumference')}:</td>
                          <td className="print-value">{calculationSummary.adjustedCircumference.toFixed(1)} {language === 'en-US' ? t('unit_in') : t('unit_cm')}</td>
                        </tr>
                        {calculationSummary.useCase && (
                          <tr>
                            <td>{t('print_use_case')}:</td>
                            <td className="print-value">{calculationSummary.useCase}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                </section>
                <section>
                    <h2 className="print-section-title">{t('print_results_title')}</h2>
                    <table>
                      <tbody>
                        <tr>
                          <td>{t('print_gauge')}:</td>
                          <td className="print-value">{calculationSummary.result.gauge} {language === 'en-US' ? t('result_gauge_value_in') : t('result_gauge_value_cm') }</td>
                        </tr>
                        {calculationSummary.result.gaugeRows && (
                           <tr>
                            <td>{t('print_row_gauge')}:</td>
                            <td className="print-value">{calculationSummary.result.gaugeRows} {language === 'en-US' ? t('result_gauge_rows_value_in') : t('result_gauge_rows_value_cm') }</td>
                          </tr>
                        )}
                        <tr>
                          <td>{t('print_required_stitches')}:</td>
                          <td className="final-result-value">{calculationSummary.result.stitches} {t('result_suffix')}</td>
                        </tr>
                        {calculationSummary.result.rows && (
                          <tr>
                            <td>{t('print_required_rows')}:</td>
                            <td className="final-result-value">{calculationSummary.result.rows} {t('result_rows_suffix')}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                </section>
            </div>
            <footer>
                <p>{t('tip')}</p>
            </footer>
        </div>
    )}
    </>
  );
};

export default App;