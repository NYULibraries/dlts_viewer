<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInitb3e09cb14a5ccd8751c64690dceefdbe
{
    public static $files = array (
        '3a37ebac017bc098e9a86b35401e7a68' => __DIR__ . '/..' . '/mongodb/mongodb/src/functions.php',
        '06dd8487319ccd8403765f5b8c9f2d61' => __DIR__ . '/..' . '/alcaeus/mongo-php-adapter/lib/Mongo/functions.php',
    );

    public static $prefixLengthsPsr4 = array (
        'P' => 
        array (
            'PackageVersions\\' => 16,
        ),
        'M' => 
        array (
            'MongoDB\\' => 8,
        ),
        'J' => 
        array (
            'Jean85\\' => 7,
        ),
        'A' => 
        array (
            'Alcaeus\\MongoDbAdapter\\' => 23,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'PackageVersions\\' => 
        array (
            0 => __DIR__ . '/..' . '/composer/package-versions-deprecated/src/PackageVersions',
        ),
        'MongoDB\\' => 
        array (
            0 => __DIR__ . '/..' . '/mongodb/mongodb/src',
        ),
        'Jean85\\' => 
        array (
            0 => __DIR__ . '/..' . '/jean85/pretty-package-versions/src',
        ),
        'Alcaeus\\MongoDbAdapter\\' => 
        array (
            0 => __DIR__ . '/..' . '/alcaeus/mongo-php-adapter/lib/Alcaeus/MongoDbAdapter',
        ),
    );

    public static $prefixesPsr0 = array (
        'M' => 
        array (
            'Mongo' => 
            array (
                0 => __DIR__ . '/..' . '/alcaeus/mongo-php-adapter/lib/Mongo',
            ),
        ),
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInitb3e09cb14a5ccd8751c64690dceefdbe::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInitb3e09cb14a5ccd8751c64690dceefdbe::$prefixDirsPsr4;
            $loader->prefixesPsr0 = ComposerStaticInitb3e09cb14a5ccd8751c64690dceefdbe::$prefixesPsr0;

        }, null, ClassLoader::class);
    }
}
