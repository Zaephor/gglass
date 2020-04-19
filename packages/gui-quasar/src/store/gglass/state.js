export default function () {
  return {
    user: false,
    groups: false,
    navDisplay: true,
    navTab: "menu",
    nav: [
      {
        id: "6730b403-1d82-4617-94b9-605340198f3d",
        label: "A",
        icon: "cloud",
        children: [
          {
            id: "33b2a141-3bbe-4a24-b1db-3acfd610418e",
            label: "A-A",
            icon: "scanner",
            path: "/a/a",
          },
        ],
      },
      {
        id: "bbc0accf-8b9b-4fce-8b04-0f0a6cc728f8",
        label: "B",
        icon: "security",
        children: [],
      },
      {
        id: "6218832b-16b0-4713-8d90-9bd494c4528e",
        label: "C",
        icon: "nature",
        children: [],
      },
      {
        id: "0f88cb36-c630-42ec-a8a0-66b636a9f1ce",
        label: "C",
        icon: "scanner",
        path: "/c",
      },
      {
        id: "4916dee1-79a4-4677-8dc0-97437fdf850e",
        label: "D",
        url: "https://google.com",
        target: "_blank",
      },
    ],
  };
}
