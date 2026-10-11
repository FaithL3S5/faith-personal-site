import { createHeadlights, parkedTrucks, type HeadlightClassNames } from "./factoryHeadlights";

const greyTruckOverMiniTruckId = "grey-truck-over";

export function prepareFactoryMarkup(markup: string, headlightClassNames: HeadlightClassNames): string {
  const document = new DOMParser().parseFromString(markup, "image/svg+xml");

  const greyTruck = document.getElementById("grey-truck");
  const miniTruck = document.getElementById("grey-mini-truck");
  if (greyTruck && miniTruck) {
    miniTruck.before(greyTruck);
    const greyTruckOverMiniTruck = greyTruck.cloneNode(true) as Element;
    greyTruckOverMiniTruck.id = greyTruckOverMiniTruckId;
    miniTruck.after(greyTruckOverMiniTruck);
  }

  for (const truck of parkedTrucks) {
    document.getElementById(truck.truckId)?.after(createHeadlights(document, truck, headlightClassNames));
  }

  return new XMLSerializer().serializeToString(document);
}
