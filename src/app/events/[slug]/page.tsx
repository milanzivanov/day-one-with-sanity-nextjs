import { client } from "@/src/sanity/client";
import { sanityFetch } from "@/src/sanity/live";
import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { PortableText } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const EVENT_QUERY = `*[
    _type == "event" &&
    slug.current == $slug
  ][0]{
  ...,
  headline->,
  venue->
}`;

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

export default async function EventPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { data: event } = await sanityFetch({
    query: EVENT_QUERY,
    params: await params
  });

  console.log("Event data:", event);

  if (!event) {
    notFound();
  }
  const {
    name,
    date,
    headline,
    image,
    details,
    format,
    doorsOpen,
    venue,
    tickets
  } = event;
  const eventImageUrl = image
    ? urlFor(image)?.width(550).height(310).url()
    : null;
  const eventDate = new Date(date).toDateString();
  const eventTime = new Date(date).toLocaleTimeString();
  const doorsOpenTime = new Date(
    new Date(date).getTime() - doorsOpen * 60000
  ).toLocaleTimeString();

  return (
    <main className="container mx-auto grid gap-12 p-12">
      <div className="mb-4">
        <Link href="/">← Back to events</Link>
      </div>
      <div className="grid items-top gap-12 sm:grid-cols-2">
        <Image
          src={eventImageUrl || "https://placehold.co/550x310/png"}
          alt={name || "Event"}
          className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
          height="310"
          width="550"
        />
        <div className="flex flex-col justify-center space-y-4">
          <div className="space-y-4">
            {format && (
              <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800 dark:text-white capitalize">
                {format.replace("-", " ")}
              </div>
            )}
            {name ? (
              <h1 className="text-4xl font-medium tracking-tighter mb-8">
                {event?.name}
              </h1>
            ) : null}
            {headline?.name ? (
              <dl className="grid grid-cols-2 gap-1 text-sm font-medium sm:gap-2 lg:text-base">
                <dd className="font-semibold">Artist</dd>
                <dt> {name}</dt>
              </dl>
            ) : null}
            <dl className="grid grid-cols-2 gap-1 text-sm font-medium sm:gap-2 lg:text-base">
              <dd className="font-semibold">Date</dd>
              <div>
                {eventDate && <dt>{eventDate}</dt>}
                {eventTime && <dt>{eventTime}</dt>}
              </div>
            </dl>
            {doorsOpenTime ? (
              <dl className="grid grid-cols-2 gap-1 text-sm font-medium sm:gap-2 lg:text-base">
                <dd className="font-semibold">Doors Open</dd>
                <div className="grid gap-1">
                  <dt>Doors Open</dt>
                  <dt>{doorsOpenTime}</dt>
                </div>
              </dl>
            ) : null}
            {venue?.name ? (
              <dl className="grid grid-cols-2 gap-1 text-sm font-medium sm:gap-2 lg:text-base">
                <div className="flex items-start">
                  <dd className="font-semibold">Venue</dd>
                </div>
                <div className="grid gap-1">
                  <dt>{venue.name}</dt>
                </div>
              </dl>
            ) : null}
          </div>
          {details && details.length > 0 && (
            <div className="prose max-w-none">
              <PortableText value={details} />
            </div>
          )}
          {tickets && (
            <a
              className="flex items-center justify-center rounded-md bg-blue-500 p-4 text-white"
              href={tickets}
            >
              Buy Tickets
            </a>
          )}
        </div>
      </div>
    </main>
  );
}
