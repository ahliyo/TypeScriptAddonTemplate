import { BaseAbility, BaseModifier, registerAbility, registerModifier } from "../lib/dota_ts_adapter";

@registerAbility()
export class typescript_skywrath_mage_ancient_seal extends BaseAbility {
    sound_cast = "Hero_SkywrathMage.AncientSeal.Target";

    OnSpellStart() {
        const seal_duration = this.GetSpecialValueFor("seal_duration");
        const target = this.GetCursorTarget()!;
        target.EmitSound(this.sound_cast);
        target.AddNewModifier(this.GetCaster(), this, modifier_typescript_ancient_seal.name, { duration: seal_duration });
    }
}

@registerModifier()
export class modifier_typescript_ancient_seal extends BaseModifier {
    particle_seal = "particles/units/heroes/hero_skywrath_mage/skywrath_mage_ancient_seal_debuff.vpcf";
    resist_debuff?: number;

    IsHidden() {
        return false;
    }

    IsDebuff() {
        return true;
    }

    IsPurgable() {
        return true;
    }

    OnCreated() {
        const ability = this.GetAbility();
        if (ability) {
            this.resist_debuff = ability.GetSpecialValueFor("resist_debuff");
        }

        const particle = ParticleManager.CreateParticle(this.particle_seal, ParticleAttachment.OVERHEAD_FOLLOW, this.GetParent());
        ParticleManager.SetParticleControlEnt(particle, 1, this.GetParent(), ParticleAttachment.ABSORIGIN_FOLLOW, "hitloc", this.GetParent().GetAbsOrigin(), true);
        this.AddParticle(particle, false, false, -1, false, true);
    }

    CheckState() {
        return { [ModifierState.SILENCED]: true };
    }

    DeclareFunctions() {
        return [ModifierFunction.MAGICAL_RESISTANCE_BONUS];
    }

    GetModifierMagicalResistanceBonus() {
        return this.resist_debuff ?? 0;
    }
}
