import OsiExplorer from "@/components/osi/OsiExplorer";
import { loadOsiLayers } from "@/lib/osiContent";

export default async function Page() {
  const layers = await loadOsiLayers();
  return <OsiExplorer layers={layers} />;
}
