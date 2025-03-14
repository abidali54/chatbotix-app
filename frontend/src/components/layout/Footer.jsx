import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background: #2c3e50;
  color: #ffffff;
  padding: 3rem 2rem 2rem;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FooterTitle = styled.h3`
  color: #3498db;
  margin-bottom: 1rem;
  font-size: 1.2rem;
`;

const FooterLink = styled(Link)`
  color: #ecf0f1;
  text-decoration: none;
  transition: color 0.3s ease;
  font-size: 0.9rem;

  &:hover {
    color: #3498db;
  }
`;

const FooterText = styled.p`
  color: #bdc3c7;
  font-size: 0.9rem;
  line-height: 1.5;
`;

const BottomBar = styled.div`
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #34495e;
  text-align: center;
  color: #bdc3c7;
  font-size: 0.8rem;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterTitle>About TraeAI</FooterTitle>
          <FooterText>
            Empowering businesses with intelligent AI solutions for customer service
            and support automation.
          </FooterText>
          <SocialLinks>
            <FooterLink to="#">Twitter</FooterLink>
            <FooterLink to="#">LinkedIn</FooterLink>
            <FooterLink to="#">GitHub</FooterLink>
          </SocialLinks>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Quick Links</FooterTitle>
          <FooterLink to="/about">About Us</FooterLink>
          <FooterLink to="/pricing">Pricing</FooterLink>
          <FooterLink to="/documentation">Documentation</FooterLink>
          <FooterLink to="/contact">Contact</FooterLink>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Legal</FooterTitle>
          <FooterLink to="/privacy-policy">Privacy Policy</FooterLink>
          <FooterLink to="/terms">Terms of Service</FooterLink>
          <FooterLink to="/cookies">Cookie Policy</FooterLink>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Contact Us</FooterTitle>
          <FooterText>Email: support@traeai.com</FooterText>
          <FooterText>Phone: +1 (555) 123-4567</FooterText>
          <FooterText>Address: 123 AI Street, Tech City, TC 12345</FooterText>
        </FooterSection>
      </FooterContent>

      <BottomBar>
        © {new Date().getFullYear()} TraeAI. All rights reserved.
      </BottomBar>
    </FooterContainer>
  );
};

export default Footer;