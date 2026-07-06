export const envConfig = () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  jwtSecret:
    process.env.JWT_SECRET ||
    (() => {
      throw new Error('JWT_SECRET is not defined');
    })(),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
});
