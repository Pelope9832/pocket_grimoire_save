<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\DBAL\Platforms\PostgreSQLPlatform;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220806161358 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        if ($this->connection->getDatabasePlatform() instanceof PostgreSQLPlatform) {
            $this->addSql('CREATE TABLE homebrew (id SERIAL NOT NULL, uuid VARCHAR(255) NOT NULL, created TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, accessed TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, json JSON NOT NULL, PRIMARY KEY(id))');
            $this->addSql('CREATE INDEX uuid_idx ON homebrew (uuid)');

            return;
        }

        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE homebrew (id INT AUTO_INCREMENT NOT NULL, uuid VARCHAR(255) NOT NULL, created DATETIME NOT NULL, accessed DATETIME NOT NULL, json JSON NOT NULL, INDEX uuid_idx (uuid), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
    }

    public function down(Schema $schema): void
    {
        if ($this->connection->getDatabasePlatform() instanceof PostgreSQLPlatform) {
            $this->addSql('DROP TABLE homebrew');

            return;
        }

        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE homebrew');
    }
}
