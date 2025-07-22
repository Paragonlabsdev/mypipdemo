const Footer = () => {
  return (
    <footer className="w-full px-6 py-4 text-center">
      <p className="text-sm text-muted-foreground">
        By messaging MyPip, you agree to our{" "}
        <a href="#" className="underline hover:text-foreground">
          Terms
        </a>{" "}
        and have read our{" "}
        <a href="#" className="underline hover:text-foreground">
          Privacy Policy
        </a>
        .
      </p>
    </footer>
  );
};

export default Footer;