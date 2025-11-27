          </div >
        </div >

  <div className="relative aspect-[4/5] overflow-hidden rounded-3xl lg:aspect-square">
    <Image
      src={photo.image.url}
      alt={photo.title}
      fill
      className="object-cover transition duration-700 hover:scale-105"
      placeholder="blur"
      blurDataURL={photo.image.placeholder}
      sizes="(min-width: 1024px) 45vw, 100vw"
      priority
    />
    <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl" />
  </div>
      </div >
    </section >
  );
};
