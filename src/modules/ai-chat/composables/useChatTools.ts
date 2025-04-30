import { z } from 'zod';

export interface ToolInfoData {
  toolName: string;
  toolInfo: string;
}

const dummyTool = {
  toolName: 'dummyTool',
  toolInfo:
    'Es gibt viele verschiedene Hobbys, die man in kurzer Zeit ausüben kann. Diese Hobbys sollten idealerweise wenig Zeit in Anspruch nehmen und einfach in den Alltag integriert werden können. Hier sind einige Ideen: 1. Lesen: Ein gutes Buch oder Artikel in einer Zeitschrift. 2. Zeichnen oder Malen: Selbst kurze Skizzen können entspannend sein. 3. Spazieren gehen: Ein schneller Spaziergang in der Natur oder in der Stadt kann erfrischend sein. 4. Yoga oder Meditation: Auch kurze Einheiten können helfen, den Kopf frei zu bekommen. 5. Fotografieren: Mit dem Handy oder einer Kamera einfach die Umgebung festhalten. 6. Musik hören oder spielen: Lieblingsmusik genießen oder ein Instrument üben. 7. Podcasts hören: Informativ und unterhaltend, kann auch während anderer Aktivitäten geschehen. 8. Gärtnern: Selbst kleine Pflanzen oder Kräuter im Wohnzimmer pflegen. 9. Kochen oder Backen: Neue Rezepte ausprobieren oder kleine Gerichte zubereiten. 10. Handarbeiten: Stricken, Häkeln oder kleine DIY-Projekte. Diese Aktivitäten können leicht in den Alltag integriert werden und bereichern die Freizeit.',
};

const toolInfoSchema = z.object({
  toolName: z.string().trim().min(1, 'Tool name is required'),
  toolInfo: z.string().trim().min(1, 'Tool info is required'),
});

export function useChatTools() {
  const activeTools = ref<ToolInfoData[]>([]);

  function setActiveTool(payload: ToolInfoData) {
    const { success, data, error } = toolInfoSchema.safeParse(payload);
    if (!success) {
      console.error('Invalid tool info data:', error.format());
      return;
    }
    activeTools.value.push({
      toolName: data.toolName,
      toolInfo: data.toolInfo,
    });
  }

  function unsetActiveTool(payload: { toolName: string }, options?: { delay: number }) {
    if (options?.delay) {
      setTimeout(() => {
        activeTools.value = activeTools.value.filter(tool => tool.toolName !== payload.toolName);
      }, options.delay);
    } else {
      activeTools.value = activeTools.value.filter(tool => tool.toolName !== payload.toolName);
    }
  }

  function clearActiveTools() {
    activeTools.value = [];
  }

  return {
    activeTools,
    setActiveTool,
    unsetActiveTool,
    clearActiveTools,
  };
}
